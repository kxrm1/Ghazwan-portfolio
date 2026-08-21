import artworksJson from './artworks.json'

export interface Artwork {
  id: string
  title: string
  category: string
  material: string
  year: number
  status: 'Available' | 'Sold' | 'Reserved'
  dimensions: string
  location: string
  series: string
  aspectRatio: string
  imageUrl?: string
  images?: string[] // Multiple shots: Primary, Side, Detail, Scale
}

export const ARTWORKS: Artwork[] = artworksJson as Artwork[]
