import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth'
import { incrementVersion } from '@/lib/version'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const filePath = path.join(process.cwd(), 'src/data/landing.json')
const pubPath = path.join(process.cwd(), 'public/api/landing.json')

interface SlideShow {
  id: string
  images: string[]
}

interface LandingData {
  heroImage: string
  titleColor: string
  description: string
  slideshows: SlideShow[]
}

const DEFAULT_LANDING: LandingData = {
  heroImage: '',
  titleColor: '#ffffff',
  description: '',
  slideshows: [
    { id: 'slide1', images: [] },
    { id: 'slide2', images: [] },
    { id: 'slide3', images: [] }
  ]
}

function getLanding(): LandingData {
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      return {
        heroImage: data.heroImage || '',
        titleColor: data.titleColor || '#ffffff',
        description: data.description || '',
        slideshows: Array.isArray(data.slideshows) ? data.slideshows : DEFAULT_LANDING.slideshows
      }
    }
  } catch (err) {
    console.error('Error reading landing data:', err)
  }
  return DEFAULT_LANDING
}

function saveLanding(data: LandingData) {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    const pubDir = path.dirname(pubPath)
    if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true })
    fs.writeFileSync(pubPath, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Error saving landing data:', err)
    throw new Error('Failed to persist landing data')
  }
}

export async function GET() {
  return NextResponse.json(getLanding())
}

export async function PUT(req: Request) {
  const auth = authenticateRequest(req)
  if (!auth) {
    return unauthorizedResponse()
  }

  try {
    const input = await req.json()
    const current = getLanding()

    const updated: LandingData = {
      heroImage: typeof input.heroImage === 'string' ? input.heroImage : current.heroImage,
      titleColor: typeof input.titleColor === 'string' ? input.titleColor : current.titleColor,
      description: typeof input.description === 'string' ? input.description : current.description,
      slideshows: Array.isArray(input.slideshows) ? input.slideshows.map((s: any, i: number) => ({
        id: s.id || `slide${i + 1}`,
        images: Array.isArray(s.images) ? s.images : []
      })) : current.slideshows
    }

    saveLanding(updated)
    incrementVersion()

    return NextResponse.json({ success: true, landing: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update landing data' }, { status: 500 })
  }
}
