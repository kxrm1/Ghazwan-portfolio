import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { ARTWORKS, Artwork } from '@/data/artworks'
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth'
import { incrementVersion } from '@/lib/version'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const filePath = path.join(process.cwd(), 'src/data/artworks.json')
const pubPath = path.join(process.cwd(), 'public/api/artworks.json')

function getArtworks(): Artwork[] {
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(fileData)
    }
  } catch (e) {
    console.error('Error reading artworks file:', e)
  }
  return ARTWORKS
}

function saveArtworks(items: Artwork[]) {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2))

    const pubDir = path.dirname(pubPath)
    if (!fs.existsSync(pubDir)) {
      fs.mkdirSync(pubDir, { recursive: true })
    }
    fs.writeFileSync(pubPath, JSON.stringify(items, null, 2))
  } catch (err) {
    console.error('Error saving artworks:', err)
    throw new Error('Failed to persist artworks')
  }
}

export async function GET() {
  const list = getArtworks()
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const input = await req.json()
    const list = getArtworks()

    const rawImages: string[] = Array.isArray(input.images)
      ? input.images.filter((url: string) => url && typeof url === 'string' && url.trim().length > 0)
      : []
    const mainImg = input.imageUrl?.trim() || rawImages[0] || ''
    const images = rawImages.length > 0 ? rawImages : (mainImg ? [mainImg] : [])

    const newItem: Artwork = {
      id: `art-${Date.now()}`,
      title: input.title?.trim() || 'Untitled Artwork',
      category: input.category?.trim() || 'Sculpture',
      material: input.material?.trim() || 'Bronze',
      year: Number(input.year) || new Date().getFullYear(),
      status: input.status === 'Sold' ? 'Sold' : input.status === 'Reserved' ? 'Reserved' : 'Available',
      dimensions: input.dimensions?.trim() || '50 x 30 x 30 cm',
      location: input.location?.trim() || 'Studio Damascus',
      series: input.series?.trim() || 'Contemporary Works',
      aspectRatio: input.aspectRatio?.trim() || 'aspect-[3/4]',
      imageUrl: mainImg,
      images: images
    }

    list.unshift(newItem)
    saveArtworks(list)
    incrementVersion()

    return NextResponse.json({ success: true, item: newItem })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create artwork' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const input = await req.json()
    const { id } = input
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const list = getArtworks()
    const index = list.findIndex(a => a.id === id)
    if (index === -1) return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })

    const updatedImages = Array.isArray(input.images)
      ? input.images.filter((url: string) => url && typeof url === 'string' && url.trim().length > 0)
      : list[index].images

    let updatedImageUrl = input.imageUrl !== undefined ? input.imageUrl?.trim() : list[index].imageUrl
    if (updatedImages && updatedImages.length > 0 && !updatedImageUrl) {
      updatedImageUrl = updatedImages[0]
    }

    list[index] = {
      ...list[index],
      ...input,
      id: list[index].id, // Prevent overwriting id
      title: input.title !== undefined ? input.title.trim() : list[index].title,
      category: input.category !== undefined ? input.category.trim() : list[index].category,
      material: input.material !== undefined ? input.material.trim() : list[index].material,
      year: input.year !== undefined ? Number(input.year) : list[index].year,
      status: input.status !== undefined ? input.status : list[index].status,
      dimensions: input.dimensions !== undefined ? input.dimensions.trim() : list[index].dimensions,
      location: input.location !== undefined ? input.location.trim() : list[index].location,
      series: input.series !== undefined ? input.series.trim() : list[index].series,
      aspectRatio: input.aspectRatio !== undefined ? input.aspectRatio.trim() : list[index].aspectRatio,
      imageUrl: updatedImageUrl,
      images: updatedImages
    }

    saveArtworks(list)
    incrementVersion()

    return NextResponse.json({ success: true, item: list[index] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update artwork' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    let list = getArtworks()
    const initialLen = list.length
    list = list.filter(a => a.id !== id)

    if (list.length === initialLen) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 })
    }

    saveArtworks(list)
    incrementVersion()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete artwork' }, { status: 500 })
  }
}
