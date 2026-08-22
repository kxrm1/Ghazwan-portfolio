#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

let sharp = null
try {
  const mod = await import('sharp')
  sharp = mod.default || mod
} catch {
  console.error('[optimize] sharp is not installed. Run `npm install` first.')
  process.exit(1)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads')
const BACKUP_DIR = path.join(UPLOADS_DIR, '_originals')
const LANDING_PATHS = [
  path.join(ROOT, 'src', 'data', 'landing.json'),
  path.join(ROOT, 'public', 'api', 'landing.json')
]
const DEFENSIVE_PATHS = [
  path.join(ROOT, 'src', 'data', 'artworks.json'),
  path.join(ROOT, 'src', 'data', 'taxonomy.json'),
  path.join(ROOT, 'public', 'api', 'artworks.json'),
  path.join(ROOT, 'public', 'api', 'taxonomy.json')
].filter(p => fs.existsSync(p))

const APPLY = process.argv.includes('--apply') || process.argv.includes('-a')
const VARIANT_WIDTHS = [640, 1200, 1920]
const BASE_MAX_EDGE = 2000
const WEBP_QUALITY = 80
const RASTER_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const MIN_SAVINGS_RATIO = 0.05

const urlFor = f => `/uploads/${f}`
const errors = []
const staleEntries = []

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    fs.createReadStream(filePath)
      .on('data', chunk => hash.update(chunk))
      .on('end', () => resolve(hash.digest('hex')))
      .on('error', reject)
  })
}

const DERIVATIVE_RE = /-\d{3,4}w\.webp$/i

async function buildWorkList() {
  const items = []
  const existing = new Set(fs.readdirSync(UPLOADS_DIR))
  for (const entry of fs.readdirSync(UPLOADS_DIR).sort()) {
    const filePath = path.join(UPLOADS_DIR, entry)
    if (!fs.statSync(filePath).isFile()) continue
    if (!RASTER_EXTS.has(path.extname(entry).toLowerCase())) continue
    if (DERIVATIVE_RE.test(entry)) continue
    // A raster file whose .webp twin already exists is a stale leftover from a previous run.
    const ext = path.extname(entry).toLowerCase()
    if (ext !== '.webp' && existing.has(`${path.basename(entry, ext)}.webp`)) {
      staleEntries.push({ filename: entry, filePath })
      continue
    }
    try {
      const meta = await sharp(filePath).metadata()
      if (!meta.width || !meta.height) throw new Error('no dimensions')
      items.push({
        filename: entry,
        filePath,
        bytes: fs.statSync(filePath).size,
        width: meta.width,
        height: meta.height
      })
    } catch (err) {
      errors.push(`${entry}: unreadable (${err.message})`)
    }
  }
  return items.sort((a, b) => a.filename.localeCompare(b.filename))
}

async function transform(sourcePath) {
  const meta = await sharp(sourcePath).metadata()
  const width = meta.width || BASE_MAX_EDGE
  const base = await sharp(sourcePath)
    .rotate()
    .resize({ width: Math.min(width, BASE_MAX_EDGE), height: BASE_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer()

  const variants = []
  for (const w of VARIANT_WIDTHS) {
    if (width < w + 120) continue
    const buffer = await sharp(sourcePath)
      .rotate()
      .resize({ width: w, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer()
    variants.push({ width: w, buffer })
  }
  return { base, variants }
}

async function main() {
  console.log(`[optimize] mode: ${APPLY ? 'APPLY' : 'DRY-RUN (pass --apply to write changes)'}`)
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error(`[optimize] uploads dir not found: ${UPLOADS_DIR}`)
    process.exit(1)
  }

  const items = await buildWorkList()

  // Pass 1: dedupe by content hash
  const groups = new Map()
  for (const item of items) {
    try {
      const hash = await hashFile(item.filePath)
      if (!groups.has(hash)) groups.set(hash, [])
      groups.get(hash).push(item)
    } catch (err) {
      errors.push(`${item.filename}: hash failed (${err.message})`)
    }
  }

  let bytesBefore = 0
  let bytesAfter = 0
  let processed = 0
  let skipped = 0
  const mapping = {}
  const transformed = []

  // Handle stale leftovers first: map them to their existing .webp twin and remove on apply.
  for (const stale of staleEntries) {
    const twinUrl = urlFor(`${path.basename(stale.filename, path.extname(stale.filename))}.webp`)
    mapping[urlFor(stale.filename)] = twinUrl
    if (APPLY) fs.rmSync(stale.filePath)
    console.log(`  STALE       ${stale.filename} -> ${path.basename(twinUrl)} [removed]`)
  }

  // Pass 2: transform keepers — all buffers computed before any writes
  for (const group of Array.from(groups.values())) {
    const keeper = group[0]
    bytesBefore += group.reduce((sum, i) => sum + i.bytes, 0)

    try {
      const { base, variants } = await transform(keeper.filePath)
      const baseName = path.basename(keeper.filename, path.extname(keeper.filename))
      const outName = `${baseName}.webp`
      const outPath = path.join(UPLOADS_DIR, outName)
      const sourceUrl = urlFor(keeper.filename)

      const replaced = base.length <= keeper.bytes * (1 - MIN_SAVINGS_RATIO)
      const sameName = outPath === keeper.filePath

      let finalUrl = sourceUrl
      let finalBytes = keeper.bytes

      if (replaced && APPLY) {
        if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })
        if (sameName) {
          fs.writeFileSync(path.join(BACKUP_DIR, keeper.filename), fs.readFileSync(keeper.filePath))
          fs.writeFileSync(outPath, base)
        } else {
          fs.writeFileSync(outPath, base)
          fs.renameSync(keeper.filePath, path.join(BACKUP_DIR, keeper.filename))
          finalUrl = urlFor(outName)
          mapping[sourceUrl] = finalUrl
        }
        finalBytes = base.length
      } else if (replaced && !APPLY) {
        finalBytes = base.length
        if (!sameName) {
          finalUrl = urlFor(outName)
          mapping[sourceUrl] = finalUrl
        }
      }

      if (APPLY) {
        for (const v of variants) {
          fs.writeFileSync(path.join(UPLOADS_DIR, `${baseName}-${v.width}w.webp`), v.buffer)
        }
      }

      bytesAfter += finalBytes + variants.reduce((sum, v) => sum + v.buffer.length, 0)

      transformed.push({
        sourceUrl,
        finalUrl,
        variants: variants.map(v => ({ width: v.width, src: `${urlFor(baseName)}-${v.width}w.webp` }))
      })

      const savedKb = ((keeper.bytes - finalBytes) / 1024).toFixed(0)
      console.log(
        `  ${replaced ? (sameName ? 'RE-ENCODED' : 'CONVERTED ') : 'kept       '} ${keeper.filename}` +
          ` -> ${path.basename(finalUrl)}${variants.length ? ` (+${variants.length} variants)` : ''}` +
          `${replaced ? ` [saved ~${savedKb} KB]` : ''}`
      )
      processed++
    } catch (err) {
      skipped++
      bytesAfter += keeper.bytes
      errors.push(`${keeper.filename}: optimize failed (${err.message})`)
      continue
    }

    // Map duplicates straight onto the keeper's FINAL url and remove them from disk
    if (group.length > 1) {
      const keeperFinal = transformed.find(t => t.sourceUrl === urlFor(keeper.filename))?.finalUrl
      if (!keeperFinal) continue
      for (const dup of group.slice(1)) {
        mapping[urlFor(dup.filename)] = keeperFinal
        if (APPLY) {
          const dupPath = path.join(UPLOADS_DIR, dup.filename)
          if (fs.existsSync(dupPath)) fs.rmSync(dupPath)
        }
        console.log(`  DUPLICATE   ${dup.filename} -> ${path.basename(keeperFinal)} [removed]`)
      }
    }
  }

  // Pass 3: rewrite landing.json (+ mirror), attach heroVariants
  const remap = url => mapping[url] || url
  let landingTouched = false
  for (const landingPath of LANDING_PATHS) {
    if (!fs.existsSync(landingPath)) continue
    try {
      const landing = JSON.parse(fs.readFileSync(landingPath, 'utf-8'))
      const updated = {
        ...landing,
        heroImage: remap(landing.heroImage || ''),
        slideshows: Array.isArray(landing.slideshows)
          ? landing.slideshows.map(s => ({ ...s, images: Array.isArray(s.images) ? s.images.map(remap) : [] }))
          : landing.slideshows
      }
      const keeper = transformed.find(t => t.finalUrl === updated.heroImage)
      updated.heroVariants = keeper && keeper.variants.length > 0 ? keeper.variants : undefined
      if (JSON.stringify(updated) !== JSON.stringify(landing)) {
        landingTouched = true
        if (APPLY) {
          fs.mkdirSync(path.dirname(landingPath), { recursive: true })
          fs.writeFileSync(landingPath, JSON.stringify(updated, null, 2))
        }
      }
    } catch (err) {
      errors.push(`${landingPath}: rewrite failed (${err.message})`)
    }
  }

  // Pass 4: defensively patch other data files that may reference old URLs
  for (const target of DEFENSIVE_PATHS) {
    let contents = fs.readFileSync(target, 'utf-8')
    let touched = false
    for (const [from, to] of Object.entries(mapping)) {
      if (contents.includes(from)) {
        contents = contents.split(from).join(to)
        touched = true
      }
    }
    if (touched && APPLY) fs.writeFileSync(target, contents)
  }

  console.log('\n[optimize] ===== SUMMARY =====')
  console.log(`  files scanned : ${items.length}`)
  console.log(`  unique kept   : ${processed}`)
  console.log(`  duplicates    : ${items.length - processed}`)
  console.log(`  skipped/errors: ${skipped + errors.length}`)
  console.log(`  bytes before  : ${(bytesBefore / 1024 / 1024).toFixed(2)} MB (incl. duplicates)`)
  console.log(`  bytes after   : ${(bytesAfter / 1024 / 1024).toFixed(2)} MB`)
  console.log(`  landing refs  : ${landingTouched ? 'rewritten' : 'unchanged'}`)
  if (!APPLY) console.log('  NOTE: dry-run only — rerun with --apply to write changes.')

  if (errors.length) {
    console.log('\n[optimize] errors:')
    for (const e of errors) console.log(`  - ${e}`)
    process.exitCode = 1
  }
}

main().catch(err => {
  console.error('[optimize] fatal:', err)
  process.exit(1)
})
