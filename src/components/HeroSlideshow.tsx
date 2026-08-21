'use client'

import React from 'react'

export default function HeroSlideshow() {
  return (
    <div className="w-full max-w-[240px] aspect-[1201/677] overflow-hidden select-none flex items-center justify-center">
      <img
        src="/hero-profile.jpg"
        alt="Ghazwan Allaf artwork feature"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="w-full h-full object-contain"
      />
    </div>
  )
}
