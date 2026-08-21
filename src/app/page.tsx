'use client'

import React, { useState, useEffect, useRef } from 'react'
import LeftSidebar from '@/components/LeftSidebar'
import ArtworkGallery from '@/components/ArtworkGallery'
import LandingPage from '@/components/LandingPage'
import { LandingData, fetchLanding } from '@/lib/api'

export default function HomePage() {
  const [landingData, setLandingData] = useState<LandingData | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLanding().then(setLandingData)
  }, [])

  const handleContinue = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!landingData) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-[#ccc] text-[10px] font-mono">Loading...</span>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#1c1c1c]">
      {/* Landing Section */}
      <LandingPage data={landingData} onContinue={handleContinue} />

      {/* Gallery Section */}
      <div ref={galleryRef}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12">
          {/* Side-by-Side 2-Column Flexbox Layout with Full Height Divider */}
          <div className="flex flex-col lg:flex-row items-stretch min-h-[calc(100vh-6rem)]">
            
            {/* Left Column: Stretches full height, inner content sticky */}
            <div className="w-full lg:w-[32%] lg:min-w-[320px] lg:max-w-[420px] lg:border-r border-[#f0f0f0] border-b lg:border-b-0 pb-10 lg:pb-0 lg:pr-10 lg:mr-10">
              <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto scrollbar-none">
                <LeftSidebar />
              </div>
            </div>

            {/* Right Column: Scrolls naturally capped to its content */}
            <div className="w-full lg:flex-1">
              <ArtworkGallery />
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
