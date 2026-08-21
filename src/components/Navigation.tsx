'use client'

import React from 'react'
import Link from 'next/link'
import HeroSlideshow from './HeroSlideshow'
import { SERVICES_LIST } from '@/data/projects'

interface NavigationProps {
  currentSection?: string
}

export default function Navigation({ currentSection }: NavigationProps) {
  return (
    <header className="w-full pt-6 pb-12 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto">
      {/* Top Identity Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-4 mb-12 md:mb-16">
        <div className="md:col-span-3">
          <Link href="/" className="inline-block text-[14px] md:text-[15px] font-normal tracking-tight hover:opacity-50 transition-opacity">
            Ghazwan Allaf
          </Link>
        </div>

        <div className="md:col-span-4">
          <span className="text-[13px] md:text-[14px] font-normal tracking-tight text-[#222]">
            Sculpture & Fine Arts
          </span>
        </div>

        <div className="md:col-span-5 flex justify-start md:justify-end">
          <HeroSlideshow />
        </div>
      </div>

      {/* 4 Column Uniform Editorial Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 md:gap-x-8 text-[12px] md:text-[13px] leading-[1.45] tracking-tight">
        
        {/* Column 1: Artworks */}
        <div className="flex flex-col">
          <div className="font-medium text-[#111] pb-2 mb-2 border-b border-[#f0f0f0]">
            <Link href="/" className="hover:opacity-50 transition-opacity">Artworks</Link>
          </div>
          <div className="space-y-1 text-[#333]">
            {SERVICES_LIST.slice(0, 4).map((service, i) => (
              <div key={i} className="hover:text-black transition-colors">{service}</div>
            ))}
          </div>
        </div>

        {/* Column 2: Mediums & Forms */}
        <div className="flex flex-col">
          <div className="font-medium text-[#111] pb-2 mb-2 border-b border-[#f0f0f0]">
            <span>Mediums & Forms</span>
          </div>
          <div className="space-y-1 text-[#333]">
            {SERVICES_LIST.slice(4, 8).map((service, i) => (
              <div key={i} className="hover:text-black transition-colors">{service}</div>
            ))}
          </div>
        </div>

        {/* Column 3: Practice & Disciplines */}
        <div className="flex flex-col">
          <div className="font-medium text-[#111] pb-2 mb-2 border-b border-[#f0f0f0]">
            <span>Practice & Disciplines</span>
          </div>
          <div className="space-y-1 text-[#333]">
            {SERVICES_LIST.slice(8).map((service, i) => (
              <div key={i} className="hover:text-black transition-colors">{service}</div>
            ))}
          </div>
        </div>

        {/* Column 4: About & Contact links */}
        <div className="flex flex-col">
          <div className="font-medium text-[#111] pb-2 mb-2 border-b border-[#f0f0f0] flex justify-between items-center">
            <Link href="/about" className="hover:opacity-50 transition-opacity">About & Contact</Link>
          </div>
          <div className="space-y-1 text-[#333]">
            <div>
              <a href="https://www.ghazwanallaf.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
                ghazwanallaf.com
              </a>
            </div>
            <div>
              <a href="https://www.artsy.net" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
                Artsy Profile
              </a>
            </div>
            <div className="text-[#666]">
              Damascus / International
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}
