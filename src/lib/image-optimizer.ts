import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getLanding, saveLanding } from '@/lib/landing-store'

let sharp: any = null
try {
  sharp = require('sharp')
} catch {}

export interface HeroVariant {
  width: number
  src: string
}

export interface OptimizeResult {
  apply: boolean
  processed: number
  skipped: number
  dedupedFiles: number
  bytesBefore: number
  bytesAfter: number
  mapping: Record<string, string>
  heroVariants?: HeroVariant[]
  errors: string[]
}

const VARIANT_WIDTHS = [640, 1200, 1920]
const BASE_MAX_EDGE = 2000
const WEBP_QUALITY = 80
const RASTER_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const MIN_SAVINGS_RATIO = 0.05

function uploadsDir(): string {
  return path.join(process.cwd(), 'public', 'uploads')
}

function urlFor(filename: string): string {
  return `/uploads/${filename}`
}

async function hashFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    fs.createReadStream(filePath)
      .on('data', chunk => hash.update(chunk))
      .on('end', () => resolve(hash.digest('hex')))
      .on('error', reject)
  })
}

const DERIVATIVE_RE = /-\d{3,4}w\.webp$/i

interface WorkItem {
  filename: string
  filePath: string
  bytes: number
  width: number
  height: number
}

async function buildWorkList(
  dir: string,
  errors: string[],
  staleEntries: { filename: string; filePath: string }[]
): Promise<WorkItem[]> {
  const items: WorkItem[] = []
  const existing = new Set(fs.readdirSync(dir))
  for (const entry of fs.readdirSync(dir).sort()) {
    const filePath = path.join(dir, entry)
    if (!fs.statSync(filePath).isFile()) continue
    const ext = path.extname(entry).toLowerCase()
    if (!RASTER_EXTS.has(ext)) continue
    if (DERIVATIVE_RE.test(entry)) continue
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
    } catch (err: any) {
      errors.push(`${entry}: unreadable (${err?.message || err})`)
    }
  }
  return items.sort((a, b) => a.filename.localeCompare(b.filename))
}

async function transform(sourcePath: string): Promise<{ base: Buffer; variants: { width: number; buffer: Buffer }[] }> {
  const meta = await sharp(sourcePath).metadata()
  const width = meta.width || BASE_MAX_EDGE
  const base = await sharp(sourcePath)
    .rotate()
    .resize({ width: Math.min(width, BASE_MAX_EDGE), height: BASE_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer()

  const variants: { width: number; buffer: Buffer }[] = []
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

function ensureBackupDir(backupDir: string): void {
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })
}

export async function optimizeUploadsDir(opts: { apply?: boolean } = {}): Promise<OptimizeResult> {
  const apply = Boolean(opts.apply)
  const errors: string[] = []
  const result: OptimizeResult = {
    apply,
    processed: 0,
    skipped: 0,
    dedupedFiles: 0,
    bytesBefore: 0,
    bytesAfter: 0,
    mapping: {},
    errors
  }

  if (!sharp) {
    errors.push('sharp is not available — run npm install and retry')
    return result
  }

  const dir = uploadsDir()
  if (!fs.existsSync(dir)) {
    errors.push(`Uploads directory not found: ${dir}`)
    return result
  }

  const backupDir = path.join(dir, '_originals')
  const staleEntries: { filename: string; filePath: string }[] = []
  const items = await buildWorkList(dir, errors, staleEntries)

  for (const stale of staleEntries) {
    const twinUrl = urlFor(`${path.basename(stale.filename, path.extname(stale.filename))}.webp`)
    result.mapping[urlFor(stale.filename)] = twinUrl
    if (apply) fs.rmSync(stale.filePath)
  }

  // Pass 1: hash-based dedupe — identical bytes collapse to lexicographically-first filename.
  const groups = new Map<string, WorkItem[]>()
  for (const item of items) {
    try {
      const hash = await hashFile(item.filePath)
      const group = groups.get(hash)
      if (group) group.push(item)
      else groups.set(hash, [item])
    } catch (err: any) {
      errors.push(`${item.filename}: hash failed (${err?.message || err})`)
    }
  }

  // Pass 2: transform each unique keeper — all buffers computed before any writes.
  interface Transformed {
    sourceUrl: string
    finalUrl: string
    finalBytes: number
    originalBytes: number
    variants: HeroVariant[]
    replaced: boolean
  }
  const transformed: Transformed[] = []

  for (const group of Array.from(groups.values())) {
    const keeper = group[0]
    result.dedupedFiles += group.length - 1
    result.bytesBefore += group.reduce((sum, i) => sum + i.bytes, 0)

    try {
      const { base, variants } = await transform(keeper.filePath)
      const baseName = path.basename(keeper.filename, path.extname(keeper.filename))
      const outName = `${baseName}.webp`
      const outPath = path.join(dir, outName)
      const sourceUrl = urlFor(keeper.filename)

      const replaced = base.length <= keeper.bytes * (1 - MIN_SAVINGS_RATIO)
      const sameName = outPath === keeper.filePath

      let finalUrl = sourceUrl
      let finalBytes = keeper.bytes

      if (replaced && apply) {
        ensureBackupDir(backupDir)
        if (sameName) {
          fs.writeFileSync(path.join(backupDir, keeper.filename), fs.readFileSync(keeper.filePath))
          fs.writeFileSync(outPath, base)
        } else {
          fs.writeFileSync(outPath, base)
          fs.renameSync(keeper.filePath, path.join(backupDir, keeper.filename))
          finalUrl = urlFor(outName)
          result.mapping[sourceUrl] = finalUrl
        }
        finalBytes = base.length
      } else if (replaced && !apply) {
        finalBytes = base.length
        if (!sameName) {
          finalUrl = urlFor(outName)
          result.mapping[sourceUrl] = finalUrl
        }
      }

      const heroVariants: HeroVariant[] = variants.map(v => ({
        width: v.width,
        src: `${urlFor(baseName)}-${v.width}w.webp`
      }))
      if (apply) {
        for (const v of variants) {
          fs.writeFileSync(path.join(dir, `${baseName}-${v.width}w.webp`), v.buffer)
        }
      }

      result.bytesAfter += finalBytes + variants.reduce((sum, v) => sum + v.buffer.length, 0)
      transformed.push({
        sourceUrl,
        finalUrl,
        finalBytes,
        originalBytes: keeper.bytes,
        variants: heroVariants,
        replaced
      })
      result.processed++
    } catch (err: any) {
      result.skipped++
      result.bytesAfter += keeper.bytes
      errors.push(`${keeper.filename}: optimize failed (${err?.message || err})`)
    }
  }

  // Pass 3: compose mapping so duplicate URLs point straight at the keeper's FINAL url.
  const finalByUrl = new Map<string, string>()
  for (const t of transformed) finalByUrl.set(t.sourceUrl, t.finalUrl)
  for (const group of Array.from(groups.values())) {
    if (group.length < 2) continue
    const keeperFinal = finalByUrl.get(urlFor(group[0].filename))
    if (!keeperFinal) continue
    for (const dup of group.slice(1)) {
      result.mapping[urlFor(dup.filename)] = keeperFinal
      if (apply) {
        const dupPath = path.join(dir, dup.filename)
        if (fs.existsSync(dupPath)) fs.rmSync(dupPath)
      }
    }
  }

  // Pass 4: rewrite landing.json (+ mirror) and defensively patch other data files.
  const hasMappingChanges = Object.keys(result.mapping).length > 0
  if (apply && (hasMappingChanges || getLanding().heroImage)) {
    const landing = getLanding()
    const remap = (url: string): string => result.mapping[url] || url
    const updated = {
      ...landing,
      heroImage: remap(landing.heroImage),
      slideshows: landing.slideshows.map(s => ({ ...s, images: s.images.map(remap) }))
    }
    const keeper = transformed.find(t => t.finalUrl === updated.heroImage)
    if (keeper && keeper.variants.length > 0) {
      updated.heroVariants = keeper.variants
      result.heroVariants = keeper.variants
    } else if (!updated.heroImage) {
      updated.heroVariants = undefined
    }
    if (JSON.stringify(updated) !== JSON.stringify(landing)) {
      saveLanding(updated)
    }
    rewriteDataRefs(result.mapping)
  }

  return result
}

function rewriteDataRefs(mapping: Record<string, string>): void {
  const candidates = [
    path.join(process.cwd(), 'src/data/artworks.json'),
    path.join(process.cwd(), 'src/data/taxonomy.json'),
    path.join(process.cwd(), 'public/api/artworks.json'),
    path.join(process.cwd(), 'public/api/taxonomy.json')
  ]
  for (const target of candidates) {
    if (!fs.existsSync(target)) continue
    let contents = fs.readFileSync(target, 'utf-8')
    let touched = false
    for (const [from, to] of Object.entries(mapping)) {
      if (contents.includes(from)) {
        contents = contents.split(from).join(to)
        touched = true
      }
    }
    if (touched) fs.writeFileSync(target, contents)
  }
}
