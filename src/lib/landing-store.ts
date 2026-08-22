import fs from 'fs'
import path from 'path'

export interface SlideShow {
  id: string
  images: string[]
}

export interface LandingData {
  heroImage: string
  titleColor: string
  description: string
  slideshows: SlideShow[]
  heroVariants?: HeroVariant[]
}

export interface HeroVariant {
  width: number
  src: string
}

const primaryPath = path.join(process.cwd(), 'src/data/landing.json')
const mirrorPath = path.join(process.cwd(), 'public/api/landing.json')

export const DEFAULT_LANDING: LandingData = {
  heroImage: '',
  titleColor: '#ffffff',
  description: '',
  slideshows: [
    { id: 'slide1', images: [] },
    { id: 'slide2', images: [] },
    { id: 'slide3', images: [] }
  ]
}

function parseLanding(raw: any): LandingData {
  return {
    heroImage: typeof raw?.heroImage === 'string' ? raw.heroImage : '',
    titleColor: typeof raw?.titleColor === 'string' ? raw.titleColor : '#ffffff',
    description: typeof raw?.description === 'string' ? raw.description : '',
    slideshows: Array.isArray(raw?.slideshows)
      ? raw.slideshows.map((s: any, i: number) => ({
          id: typeof s?.id === 'string' ? s.id : `slide${i + 1}`,
          images: Array.isArray(s?.images) ? s.images.filter((u: any) => typeof u === 'string') : []
        }))
      : DEFAULT_LANDING.slideshows,
    heroVariants: Array.isArray(raw?.heroVariants)
      ? raw.heroVariants.filter((v: any) => v && typeof v.src === 'string')
      : undefined
  }
}

export function getLanding(): LandingData {
  try {
    if (fs.existsSync(primaryPath)) {
      return parseLanding(JSON.parse(fs.readFileSync(primaryPath, 'utf-8')))
    }
    if (fs.existsSync(mirrorPath)) {
      return parseLanding(JSON.parse(fs.readFileSync(mirrorPath, 'utf-8')))
    }
  } catch (err) {
    console.error('Error reading landing data:', err)
  }
  return DEFAULT_LANDING
}

export function saveLanding(data: LandingData): void {
  try {
    for (const target of [primaryPath, mirrorPath]) {
      const dir = path.dirname(target)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(target, JSON.stringify(data, null, 2))
    }
  } catch (err) {
    console.error('Error saving landing data:', err)
    throw new Error('Failed to persist landing data')
  }
}
