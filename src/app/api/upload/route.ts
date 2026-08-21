import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth'

let sharp: any = null
try {
  sharp = require('sharp')
} catch {}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024 // 15MB
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
])

async function optimizeAndSaveImage(buffer: Buffer, uploadDir: string, rawExt: string): Promise<string> {
  const randomHash = crypto.randomBytes(6).toString('hex')
  const baseName = `art_${Date.now()}_${randomHash}`

  if (sharp) {
    try {
      // Auto-orient EXIF, resize if > 2400px, compress to modern WebP (85% quality)
      const filename = `${baseName}.webp`
      const filepath = path.join(uploadDir, filename)

      await sharp(buffer)
        .rotate() // auto-orient based on EXIF
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(filepath)

      return `/uploads/${filename}`
    } catch (sharpErr) {
      console.warn('Sharp optimization error, falling back to direct write:', sharpErr)
    }
  }

  // Fallback to direct raw file write if sharp is unavailable
  const safeExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.jpg'
  const filename = `${baseName}${safeExt}`
  const filepath = path.join(uploadDir, filename)
  fs.writeFileSync(filepath, buffer)
  return `/uploads/${filename}`
}

export async function POST(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const contentType = req.headers.get('content-type') || ''
    const urls: string[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const files = formData.getAll('files') as File[]

      if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No files provided' }, { status: 400 })
      }

      for (const file of files) {
        if (!file || typeof file.arrayBuffer !== 'function') continue

        // Check file size (15MB limit)
        if (file.size > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: `File "${file.name}" exceeds maximum allowed size (15MB)` },
            { status: 400 }
          )
        }

        // Check extension & mime type
        const rawExt = path.extname(file.name || '').toLowerCase()
        const ext = rawExt === '.jpeg' ? '.jpg' : rawExt

        if (!ALLOWED_EXTENSIONS.has(rawExt) && !ALLOWED_MIME_TYPES.has(file.type)) {
          return NextResponse.json(
            { error: `File type "${file.type || rawExt}" not supported. Allowed: JPG, PNG, WEBP, GIF, AVIF` },
            { status: 400 }
          )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const savedUrl = await optimizeAndSaveImage(buffer, uploadDir, ext)
        urls.push(savedUrl)
      }
    } else {
      // Base64 upload support
      const json = await req.json()
      if (Array.isArray(json.images)) {
        for (const imgData of json.images) {
          if (typeof imgData !== 'string') continue
          const match = imgData.match(/^data:image\/(\w+);base64,(.+)$/)
          if (match) {
            let ext = match[1].toLowerCase()
            if (ext === 'jpeg') ext = 'jpg'
            const dotExt = `.${ext}`

            if (!ALLOWED_EXTENSIONS.has(dotExt)) {
              continue
            }

            const buffer = Buffer.from(match[2], 'base64')
            if (buffer.length > MAX_FILE_SIZE_BYTES) {
              return NextResponse.json(
                { error: 'Image exceeds maximum allowed size (15MB)' },
                { status: 400 }
              )
            }

            const savedUrl = await optimizeAndSaveImage(buffer, uploadDir, dotExt)
            urls.push(savedUrl)
          }
        }
      }
    }

    if (urls.length > 0) {
      return NextResponse.json({ success: true, urls })
    }

    return NextResponse.json({ error: 'No valid image files processed' }, { status: 400 })
  } catch (e: any) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 })
  }
}
