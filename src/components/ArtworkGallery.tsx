'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ARTWORKS, Artwork } from '@/data/artworks'
import { fetchArtworks, fetchTaxonomy, Taxonomy } from '@/lib/api'
import { useLiveSync } from '@/lib/live-sync'
import PlaceholderImage from './PlaceholderImage'

export default function ArtworkGallery() {
  const [artworksList, setArtworksList] = useState<Artwork[]>(ARTWORKS)
  const [taxonomy, setTaxonomy] = useState<Taxonomy>({ categories: [], materials: [] })
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null)
  const [activeShotIndex, setActiveShotIndex] = useState<number>(0)
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'grid'>('masonry')

  const reloadData = useCallback(async () => {
    try {
      const [data, tax] = await Promise.all([fetchArtworks(), fetchTaxonomy()])
      if (Array.isArray(data)) {
        setArtworksList(data)
      }
      if (tax && Array.isArray(tax.categories) && Array.isArray(tax.materials)) {
        setTaxonomy(tax)
      }
    } catch (err) {
      console.warn('Failed to refresh gallery data:', err)
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    reloadData()
  }, [reloadData])

  // Instant Live Synchronization via SSE + BroadcastChannel
  const { isConnected } = useLiveSync({ onUpdate: reloadData })

  // Prevent background scrolling when fullscreen view is open
  useEffect(() => {
    if (activeArtwork) {
      document.body.style.overflow = 'hidden'
      setActiveShotIndex(0)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [activeArtwork])

  // Dynamic Categories: Taxonomy as the single source of truth from admin
  const categories = useMemo(() => {
    if (taxonomy.categories && taxonomy.categories.length > 0) {
      return ['All', ...taxonomy.categories]
    }
    const set = new Set<string>()
    artworksList.forEach(a => {
      if (a.category) set.add(a.category)
    })
    return ['All', ...Array.from(set)]
  }, [artworksList, taxonomy])

  // Dynamic Materials: Taxonomy as the single source of truth from admin
  const materials = useMemo(() => {
    if (taxonomy.materials && taxonomy.materials.length > 0) {
      return ['All', ...taxonomy.materials]
    }
    const set = new Set<string>()
    artworksList.forEach((a) => {
      if (!a.material) return
      const tokens = a.material
        .split(/[,/&+]|\band\b/i)
        .map((m) => m.trim())
        .filter((m) => m.length > 0)
      tokens.forEach((t) => set.add(t))
    })
    return ['All', ...Array.from(set).sort()]
  }, [artworksList, taxonomy])

  // Reset selected filters if the item was deleted from taxonomy in admin
  useEffect(() => {
    if (selectedCategory !== 'All' && !categories.includes(selectedCategory)) {
      setSelectedCategory('All')
    }
  }, [categories, selectedCategory])

  useEffect(() => {
    if (selectedMaterial !== 'All' && !materials.includes(selectedMaterial)) {
      setSelectedMaterial('All')
    }
  }, [materials, selectedMaterial])

  // Dynamic year bounds from dataset
  const { minYear, maxYear } = useMemo(() => {
    if (artworksList.length === 0) return { minYear: 1990, maxYear: new Date().getFullYear() }
    const years = artworksList.map(a => a.year).filter(Boolean)
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years, new Date().getFullYear())
    }
  }, [artworksList])

  const [yearMin, setYearMin] = useState<number>(1990)
  const [yearMax, setYearMax] = useState<number>(new Date().getFullYear())
  const statuses = ['All', 'Available', 'Sold']

  // Keep year state bounded when artworks load
  useEffect(() => {
    if (minYear && maxYear) {
      setYearMin(minYear)
      setYearMax(maxYear)
    }
  }, [minYear, maxYear])

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    return artworksList.filter((art) => {
      if (selectedCategory !== 'All' && art.category !== selectedCategory) return false

      // Multi-material match: check if selectedMaterial matches any of the item's materials
      if (selectedMaterial !== 'All') {
        if (!art.material) return false
        const artTokens = art.material
          .toLowerCase()
          .split(/[,/&+]|\band\b/i)
          .map((m) => m.trim())
          .filter((m) => m.length > 0)
        const target = selectedMaterial.toLowerCase()
        const matches = artTokens.some((t) => t.includes(target) || target.includes(t))
        if (!matches) return false
      }

      if (selectedStatus !== 'All' && art.status !== selectedStatus) return false
      
      // Period range filter
      if (art.year < yearMin || art.year > yearMax) return false

      return true
    })
  }, [artworksList, selectedCategory, selectedMaterial, selectedStatus, yearMin, yearMax])

  const resetFilters = () => {
    setSelectedCategory('All')
    setSelectedMaterial('All')
    setSelectedStatus('All')
    setYearMin(minYear)
    setYearMax(maxYear)
  }

  const hasActiveFilters = selectedCategory !== 'All' || selectedMaterial !== 'All' || selectedStatus !== 'All' || yearMin !== minYear || yearMax !== maxYear

  // Helper to get active shots array
  const activeShots = useMemo(() => {
    if (!activeArtwork) return []
    if (activeArtwork.images && activeArtwork.images.length > 0) {
      return activeArtwork.images
    }
    if (activeArtwork.imageUrl) {
      return [activeArtwork.imageUrl]
    }
    return []
  }, [activeArtwork])

  const shotLabels = ['Primary View', 'Side Profile', 'Detail Texture', 'Scale & Environment']

  return (
    <section className="w-full pb-4">
      {/* Top Header Row */}
      <div className="flex justify-between items-center gap-2 border-b border-[#111] pb-2 mb-5 min-h-[26px]">
        <div className="text-[11px] md:text-[12px] font-normal text-[#111] flex items-center gap-2">
          <span>Work</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] md:text-[11px]">
          {/* Layout Changer */}
          <div className="flex items-center gap-1.5 text-[#888]">
            <button
              onClick={() => setLayoutMode('masonry')}
              className={`inline-flex items-center gap-1 transition-colors px-1 py-0.5 ${
                layoutMode === 'masonry'
                  ? 'text-[#111] font-semibold underline underline-offset-2'
                  : 'text-[#888] hover:text-[#111]'
              }`}
              title="Masonry layout"
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="8" rx="0.5" />
                <rect x="9" y="1" width="6" height="5" rx="0.5" />
                <rect x="1" y="10" width="6" height="5" rx="0.5" />
                <rect x="9" y="7" width="6" height="8" rx="0.5" />
              </svg>
              <span>Masonry</span>
            </button>
            <span className="text-[#ccc]">/</span>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`inline-flex items-center gap-1 transition-colors px-1 py-0.5 ${
                layoutMode === 'grid'
                  ? 'text-[#111] font-semibold underline underline-offset-2'
                  : 'text-[#888] hover:text-[#111]'
              }`}
              title="Small grid layout"
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="4" height="4" rx="0.5" />
                <rect x="6" y="1" width="4" height="4" rx="0.5" />
                <rect x="11" y="1" width="4" height="4" rx="0.5" />
                <rect x="1" y="6" width="4" height="4" rx="0.5" />
                <rect x="6" y="6" width="4" height="4" rx="0.5" />
                <rect x="11" y="6" width="4" height="4" rx="0.5" />
                <rect x="1" y="11" width="4" height="4" rx="0.5" />
                <rect x="6" y="11" width="4" height="4" rx="0.5" />
                <rect x="11" y="11" width="4" height="4" rx="0.5" />
              </svg>
              <span>Grid</span>
            </button>
          </div>

          <span className="text-[#ccc]">·</span>

          <div className="text-[10px] md:text-[11px] text-[#777]">
            {filteredArtworks.length} of {artworksList.length} items
          </div>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <div className="border-b border-[#f0f0f0] pb-5 mb-6 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] md:text-[11px]">
          <div>
            <div className="text-[#888] text-[9.5px] mb-0.5">category</div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`transition-colors ${
                    selectedCategory === cat
                      ? 'text-[#111] font-semibold underline underline-offset-2'
                      : 'text-[#666] hover:text-[#111]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[#888] text-[9.5px] mb-0.5">material</div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`transition-colors ${
                    selectedMaterial === mat
                      ? 'text-[#111] font-semibold underline underline-offset-2'
                      : 'text-[#666] hover:text-[#111]'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[#888] text-[9.5px] mb-0.5">status</div>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`transition-colors ${
                    selectedStatus === st
                      ? 'text-[#111] font-semibold underline underline-offset-2'
                      : 'text-[#666] hover:text-[#111]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline text-[#888] text-[9.5px] mb-0.5">
              <span>period</span>
              <span className="text-[#111] font-mono text-[9.5px]">
                {yearMin} — {yearMax}
              </span>
            </div>
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={yearMin}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), yearMax)
                    setYearMin(val)
                  }}
                  className="w-full h-1 bg-[#e0e0e0] appearance-none cursor-pointer accent-[#111]"
                  title={`From year: ${yearMin}`}
                />
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={yearMax}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), yearMin)
                    setYearMax(val)
                  }}
                  className="w-full h-1 bg-[#e0e0e0] appearance-none cursor-pointer accent-[#111]"
                  title={`To year: ${yearMax}`}
                />
              </div>
              <div className="flex justify-between text-[9px] text-[#999]">
                <span>{minYear}</span>
                <span>{maxYear}</span>
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-1">
            <button
              onClick={resetFilters}
              className="text-[10px] text-[#999] hover:text-[#111] underline transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Stream of Artworks (Masonry or Small Item Grid) */}
      {filteredArtworks.length === 0 ? (
        <div className="py-16 text-center text-[11px] text-[#888]">
          No artworks match the selected filter criteria.
        </div>
      ) : layoutMode === 'masonry' ? (
        <div className="columns-1 sm:columns-2 gap-5 md:gap-7 [column-fill:_balance]">
          <AnimatePresence>
            {filteredArtworks.map((art) => {
              const displayImg = art.imageUrl || (art.images && art.images[0]) || ''
              return (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActiveArtwork(art)}
                  className="group cursor-pointer mb-6 break-inside-avoid space-y-2 block"
                >
                  {/* Artwork Title & Year */}
                  <div className="flex justify-between items-baseline text-[11px] md:text-[12px] leading-tight">
                    <span className="text-[#111] font-normal group-hover:opacity-60 transition-opacity">
                      {art.title}, {art.year}
                    </span>
                    <span className="text-[#777] text-[10px]">
                      {art.status}
                    </span>
                  </div>

                  {/* Artwork Image or Fallback */}
                  <div className="relative overflow-hidden bg-white">
                    <PlaceholderImage
                      src={displayImg}
                      aspectRatio={art.aspectRatio}
                      objectFit="contain"
                      label={`${art.title}`}
                      alt={art.title}
                      className="bg-white"
                    />
                  </div>

                  {/* Artwork Specs */}
                  <div className="text-[10px] md:text-[11px] leading-[0.9] text-[#555] space-y-0.5 pt-0.5">
                    <div>{art.material} · {art.dimensions}</div>
                    <div className="text-[#999] text-[9.5px]">{art.location}</div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8">
          <AnimatePresence>
            {filteredArtworks.map((art) => {
              const displayImg = art.imageUrl || (art.images && art.images[0]) || ''
              return (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActiveArtwork(art)}
                  className="group cursor-pointer space-y-2 block"
                >
                  {/* Grid Item Box: Capped vertically, white background, zero cropping */}
                  <div className="relative overflow-hidden bg-white w-full h-[180px] sm:h-[200px] md:h-[220px] flex items-center justify-center">
                    <PlaceholderImage
                      src={displayImg}
                      aspectRatio="h-full w-full"
                      objectFit="contain"
                      label={`${art.title}`}
                      alt={art.title}
                      className="h-full w-full bg-white flex items-center justify-center"
                      imageClassName="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                  </div>

                  {/* Artwork Title & Year */}
                  <div className="space-y-0.5 text-[10px] md:text-[11px] leading-tight pt-1">
                    <div className="flex justify-between items-baseline gap-1">
                      <span className="text-[#111] font-normal truncate group-hover:opacity-60 transition-opacity">
                        {art.title}
                      </span>
                      <span className="text-[#888] text-[9px] shrink-0 font-mono">
                        {art.year}
                      </span>
                    </div>
                    <div className="text-[#666] text-[9.5px] truncate">
                      {art.material}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Fullscreen White Detail Push Screen */}
      <AnimatePresence>
        {activeArtwork && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto text-[#1c1c1c]"
          >
            {/* Top Navigation Bar with Small '✕' Close Button */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#111]">
              <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-3 flex justify-between items-baseline">
                <div className="text-[12px] md:text-[13px] font-normal text-[#111]">
                  Ghazwan Allaf
                </div>
                <button
                  onClick={() => setActiveArtwork(null)}
                  aria-label="Close"
                  className="text-[12px] text-[#111] hover:opacity-50 transition-opacity p-1 inline-flex items-center gap-1"
                >
                  <span className="text-[14px] leading-none">✕</span>
                </button>
              </div>
            </div>

            {/* Split Content: Left Sticky Details | Right Image Gallery & Multi-Shot Row */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-10">
              <div className="flex flex-col lg:flex-row items-stretch min-h-[calc(100vh-6rem)]">
                
                {/* Left Side: Stretches full height, inner content pinned */}
                <div className="w-full lg:w-[320px] xl:w-[350px] lg:border-r border-[#f0f0f0] border-b lg:border-b-0 pb-6 lg:pb-0 lg:pr-8 lg:mr-8">
                  <div className="lg:sticky lg:top-[60px] lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto scrollbar-none space-y-6 text-[11px] md:text-[12px] leading-[1.35] tracking-tight">
                    <div className="space-y-0.5 pb-3 border-b border-[#f0f0f0]">
                      <h1 className="text-[18px] md:text-[20px] font-normal text-[#111] tracking-tight">
                        {activeArtwork.title}
                      </h1>
                      <div className="text-[11px] text-[#777]">
                        {activeArtwork.series} — {activeArtwork.year}
                      </div>
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-2.5 pt-0.5">
                      <div>
                        <span className="text-[#888] text-[9.5px] block">(category)</span>
                        <span className="text-[#111]">{activeArtwork.category}</span>
                      </div>

                      <div>
                        <span className="text-[#888] text-[9.5px] block">(material)</span>
                        <span className="text-[#111]">{activeArtwork.material}</span>
                      </div>

                      <div>
                        <span className="text-[#888] text-[9.5px] block">(dimensions)</span>
                        <span className="text-[#111]">{activeArtwork.dimensions}</span>
                      </div>

                      <div>
                        <span className="text-[#888] text-[9.5px] block">(status)</span>
                        <span className="text-[#111]">{activeArtwork.status}</span>
                      </div>

                      <div>
                        <span className="text-[#888] text-[9.5px] block">(location)</span>
                        <span className="text-[#111]">{activeArtwork.location}</span>
                      </div>
                    </div>

                    {/* Inquire CTA */}
                    <div className="pt-4 border-t border-[#f0f0f0] space-y-2">
                      <div className="text-[#888] text-[9.5px]">
                        (inquiries & acquisition)
                      </div>
                      <div>
                        <a
                          href="https://www.ghazwanallaf.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-[#111] underline underline-offset-4 hover:opacity-50 transition-opacity"
                        >
                          Inquire via ghazwanallaf.com →
                        </a>
                      </div>
                      <div>
                        <a
                          href="https://www.artsy.net"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-[#666] underline underline-offset-4 hover:opacity-50 transition-opacity text-[10.5px]"
                        >
                          View artist profile on Artsy
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Selected Image View + Row of Multiple Shots */}
                <div className="w-full lg:flex-1 space-y-8 max-w-[820px]">
                  
                  {/* Active Focused Image Display */}
                  <div className="bg-[#f6f6f6] overflow-hidden max-w-[620px] mx-auto lg:mx-0 shadow-sm border border-[#eeeeee]">
                    <PlaceholderImage
                      src={activeShots[activeShotIndex] || activeArtwork.imageUrl || ''}
                      aspectRatio="aspect-[4/3]"
                      label={`${activeArtwork.title}`}
                      alt={`${activeArtwork.title} view ${activeShotIndex + 1}`}
                      className="w-full"
                    />
                  </div>

                  {/* Multi-shot Row / Thumbnail Gallery */}
                  {activeShots.length > 1 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[#888] text-[11px]">
                        (alternate views & detail shots)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                        {activeShots.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveShotIndex(idx)}
                            className={`cursor-pointer group space-y-1.5 transition-opacity ${
                              activeShotIndex === idx ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                            }`}
                          >
                            <div className="bg-[#f2f2f2] overflow-hidden">
                              <PlaceholderImage
                                src={imgUrl}
                                aspectRatio="aspect-[1/1]"
                                label={`[${idx + 1}]`}
                                alt={`Shot ${idx + 1}`}
                              />
                            </div>
                            <div 
                              className={`text-[10px] md:text-[11px] truncate transition-colors ${
                                activeShotIndex === idx 
                                  ? 'text-[#111] font-semibold underline underline-offset-2' 
                                  : 'text-[#555]'
                              }`}
                            >
                              {shotLabels[idx] || `View ${idx + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Perspective View if available */}
                  {activeShots.length > 2 && (
                    <div className="pt-8 border-t border-[#f0f0f0] space-y-4">
                      <div className="text-[#888] text-[11px]">
                        (full angle perspective)
                      </div>
                      <div className="bg-[#f6f6f6] overflow-hidden max-w-[620px] border border-[#eeeeee]">
                        <PlaceholderImage
                          src={activeShots[activeShots.length - 1]}
                          aspectRatio="aspect-[16/9]"
                          label={`${activeArtwork.title} — Angle View`}
                          alt={`${activeArtwork.title} angle`}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </motion.div> 
        )}
      </AnimatePresence>
    </section>
  )
}
