import { Artwork, ARTWORKS } from '@/data/artworks'

// v1.1.0 - Landing Page API Support
const isProd = process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.location.protocol !== 'http:'
const API_BASE = '/api'

export interface Taxonomy {
  categories: string[]
  materials: string[]
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ghazwan_admin_token')
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ghazwan_admin_token', token)
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ghazwan_admin_token')
  }
}

export function notifyArtworksChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('artworks_updated'))
    try {
      const channel = new BroadcastChannel('ghazwan_artworks_channel')
      channel.postMessage({ type: 'ARTWORKS_MUTATED', timestamp: Date.now() })
      channel.close()
    } catch {}
  }
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const token = getAuthToken()
  const url = `${API_BASE}/upload`

  const formData = new FormData()
  files.forEach(f => formData.append('files', f))

  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData
  })

  const data = await res.json()

  if (res.ok && data.urls) {
    return data.urls
  }
  throw new Error(data?.error || 'Image upload failed')
}

export async function fetchArtworks(): Promise<Artwork[]> {
  try {
    const url = `${API_BASE}/artworks?t=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        return data
      }
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to static dataset:', err)
  }
  return ARTWORKS
}

export async function createArtwork(data: Partial<Artwork>): Promise<{ success: boolean; error?: string; item?: Artwork }> {
  try {
    const token = getAuthToken()
    const url = `${API_BASE}/artworks`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    const json = await res.json()
    if (res.ok && json.success) {
      notifyArtworksChanged()
      return { success: true, item: json.item }
    }
    return { success: false, error: json.error || 'Failed to create artwork' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}

export async function updateArtwork(id: string, data: Partial<Artwork>): Promise<{ success: boolean; error?: string; item?: Artwork }> {
  try {
    const token = getAuthToken()
    const url = `${API_BASE}/artworks`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, ...data })
    })
    const json = await res.json()
    if (res.ok && json.success) {
      notifyArtworksChanged()
      return { success: true, item: json.item }
    }
    return { success: false, error: json.error || 'Failed to update artwork' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}

export async function deleteArtwork(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken()
    const url = `${API_BASE}/artworks?id=${encodeURIComponent(id)}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const json = await res.json()
    if (res.ok && json.success) {
      notifyArtworksChanged()
      return { success: true }
    }
    return { success: false, error: json.error || 'Failed to delete artwork' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}

// Taxonomy CRUD (Categories & Materials)
export async function fetchTaxonomy(): Promise<Taxonomy> {
  try {
    const url = `${API_BASE}/taxonomy?t=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data && Array.isArray(data.categories)) {
        return data
      }
    }
  } catch (err) {
    console.warn('Taxonomy fetch failed:', err)
  }
  return {
    categories: ['Sculpture', 'Painting', 'Jewelry', 'Monument'],
    materials: ['Bronze', 'Marble', 'Wood', 'Stone & Basalt', 'Clay & Terracotta', 'Silver', 'Gold', 'Mixed Media', 'Oil & Charcoal', 'Ceramics', 'Glass', 'Steel & Iron']
  }
}

export async function addTaxonomyItem(type: 'category' | 'material', name: string): Promise<{ success: boolean; taxonomy?: Taxonomy; error?: string }> {
  try {
    const token = getAuthToken()
    const url = `${API_BASE}/taxonomy`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type, name })
    })
    const data = await res.json()
    if (res.ok && data.success) {
      notifyArtworksChanged()
      return { success: true, taxonomy: data.taxonomy }
    }
    return { success: false, error: data.error || 'Failed to add item' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}

export async function editTaxonomyItem(type: 'category' | 'material', oldName: string, newName: string): Promise<{ success: boolean; taxonomy?: Taxonomy; error?: string }> {
  try {
    const token = getAuthToken()
    const url = `${API_BASE}/taxonomy`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type, oldName, newName })
    })
    const data = await res.json()
    if (res.ok && data.success) {
      notifyArtworksChanged()
      return { success: true, taxonomy: data.taxonomy }
    }
    return { success: false, error: data.error || 'Failed to edit item' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}

export async function deleteTaxonomyItem(type: 'category' | 'material', name: string): Promise<{ success: boolean; taxonomy?: Taxonomy; error?: string }> {
  try {
    const token = getAuthToken()
    const url = `${API_BASE}/taxonomy?type=${type}&name=${encodeURIComponent(name)}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (res.ok && data.success) {
      notifyArtworksChanged()
      return { success: true, taxonomy: data.taxonomy }
    }
    return { success: false, error: data.error || 'Failed to delete item' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}

// Landing Page CRUD
export interface LandingSlideshow {
  id: string
  images: string[]
}

export interface LandingData {
  heroImage: string
  titleColor: string
  description: string
  slideshows: LandingSlideshow[]
}

export async function fetchLanding(): Promise<LandingData> {
  try {
    const url = `${API_BASE}/landing?t=${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.heroImage === 'string') {
        return data
      }
    }
  } catch (err) {
    console.warn('Landing fetch failed:', err)
  }
  return {
    heroImage: '',
    titleColor: '#ffffff',
    description: '',
    slideshows: [
      { id: 'slide1', images: [] },
      { id: 'slide2', images: [] },
      { id: 'slide3', images: [] }
    ]
  }
}

export async function updateLanding(data: Partial<LandingData>): Promise<{ success: boolean; landing?: LandingData; error?: string }> {
  try {
    const token = getAuthToken()
    const url = `${API_BASE}/landing`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    const json = await res.json()
    if (res.ok && json.success) {
      notifyArtworksChanged()
      return { success: true, landing: json.landing }
    }
    return { success: false, error: json.error || 'Failed to update landing' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' }
  }
}
