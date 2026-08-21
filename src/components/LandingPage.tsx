'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SlideShow {
  id: string
  images: string[]
}

export interface LandingData {
  heroImage: string
  titleColor: string
  description: string
  slideshows: SlideShow[]
}

interface LandingPageProps {
  data: LandingData
  onContinue: () => void
}

function SlideshowBox({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (images.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 3500)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-[#f6f6f6] flex items-center justify-center">
        <span className="text-[#ccc] text-[10px] font-mono">No images</span>
      </div>
    )
  }

  return (
    <div className="w-full aspect-square bg-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${images[current]}-${current}`}
          src={images[current]}
          alt={`Slideshow image ${current + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </AnimatePresence>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                i === current ? 'bg-[#111] w-3' : 'bg-[#ccc]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LandingPage({ data, onContinue }: LandingPageProps) {
  return (
    <div className="w-full">
      {/* Fullscreen Hero Section */}
      <section className="relative w-full h-screen flex items-end overflow-hidden">
        {/* Background Image */}
        {data.heroImage && (
          <img
            src={data.heroImage}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {!data.heroImage && (
          <div className="absolute inset-0 bg-[#f0f0f0] flex items-center justify-center">
            <span className="text-[#ccc] text-[10px] font-mono">Hero image not set</span>
          </div>
        )}

        {/* Overlay Text */}
        <div className="relative z-10 p-6 md:p-12 pb-12 md:pb-16 max-w-[800px]">
          <h1
            className="font-normal tracking-tight leading-none mb-3"
            style={{ color: data.titleColor, fontSize: '32px' }}
          >
            Ghazwan Allaf
          </h1>
          {data.description && (
            <p
              className="leading-[1.4] max-w-[480px]"
              style={{ color: data.titleColor, fontSize: '11px', opacity: 0.85 }}
            >
              {data.description}
            </p>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-6 md:right-12 z-10">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ color: data.titleColor, fontSize: '10px', opacity: 0.6 }}
          >
            Scroll ↓
          </motion.div>
        </div>
      </section>

      {/* Three Slideshow Boxes */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {data.slideshows.map((slideshow) => (
            <SlideshowBox key={slideshow.id} images={slideshow.images} />
          ))}
        </div>

        {/* Continue to Gallery */}
        <div className="flex justify-center pt-12 md:pt-16">
          <button
            onClick={onContinue}
            className="group flex items-center gap-2 text-[#111] hover:opacity-50 transition-opacity"
            style={{ fontSize: '11px' }}
          >
            <span className="border-b border-[#111] pb-0.5">Continue to Gallery</span>
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </button>
        </div>
      </section>
    </div>
  )
}
