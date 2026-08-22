import { NextResponse } from 'next/server'
import { authenticateRequest, unauthorizedResponse } from '@/lib/auth'
import { incrementVersion } from '@/lib/version'
import { getLanding, saveLanding, LandingData } from '@/lib/landing-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    if (updated.heroImage !== current.heroImage) {
      if (Array.isArray(input.heroVariants)) {
        const heroBase = updated.heroImage.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
        const filteredVariants = input.heroVariants.filter((v: any) => {
          if (!v || typeof v.src !== 'string') return false
          const variantBase = v.src.split('/').pop()?.replace(/(-\d+w)?\.[^/.]+$/, '') || ''
          return heroBase && variantBase === heroBase
        })
        updated.heroVariants = filteredVariants.length > 0 ? filteredVariants : undefined
      } else {
        updated.heroVariants = undefined
      }
    } else if (Array.isArray(input.heroVariants)) {
      updated.heroVariants = input.heroVariants.filter((v: any) => v && typeof v.src === 'string')
    } else {
      updated.heroVariants = current.heroVariants
    }

    saveLanding(updated)
    incrementVersion()

    return NextResponse.json({ success: true, landing: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update landing data' }, { status: 500 })
  }
}
