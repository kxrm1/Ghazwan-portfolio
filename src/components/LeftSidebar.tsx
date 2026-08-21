'use client'

import React from 'react'
import Link from 'next/link'
import HeroSlideshow from './HeroSlideshow'
import { SERVICES_LIST } from '@/data/projects'

export default function LeftSidebar() {
  return (
    <aside className="w-full space-y-8 text-[11px] md:text-[12px] leading-[0.9] tracking-tight select-text">
      
      {/* Header Row: Name & Info */}
      <div className="flex justify-between items-center border-b border-[#111] pb-2 min-h-[26px]">
        <Link href="/" className="font-normal text-[#111] hover:opacity-50 transition-opacity">
          Ghazwan Allaf
        </Link>
        <Link href="/about" className="text-[#111] hover:opacity-50 transition-opacity">
          Exhibitions
        </Link>
      </div>

      {/* Main Bio / Statement */}
      <div className="text-[#222] space-y-3 pr-0 md:pr-4">
        <p className="leading-[0.9]">
          Ghazwan Allaf is a Syrian sculptor and educator born in Damascus, specializing in contemporary sculpture, anatomy, and three-dimensional artistic forms. Graduated from the Institute of Applied Arts in 1993, blending artistic creation, fine arts pedagogy, and architectural commissions.
        </p>
      </div>

      {/* Slide thumbnail animation preview */}
      <div className="pt-1">
        <HeroSlideshow />
      </div>

      {/* (exhibitions / institutions) section */}
      <div className="space-y-1.5">
        <div className="text-[#888] text-[10px]">
          exhibitions & institutions
        </div>
        <p className="text-[#222] leading-[0.9]">
          Adham Ismael Center for Fine Arts, Syrian Plastic Artists Union, AL-SAYED Art Gallery Damascus, KAWAF Art Gallery Aleppo, Artuel Beirut, Artsy.
        </p>
      </div>

      {/* 2-column grid for (disciplines) and (practice) */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
        {/* Column 1: Services / Disciplines */}
        <div className="space-y-1.5">
          <div className="text-[#888] text-[10px]">
            disciplines
          </div>
          <div className="space-y-0.5 text-[#222]">
            {SERVICES_LIST.slice(0, 5).map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>
        </div>

        {/* Column 2: Materials & Focus */}
        <div className="space-y-1.5">
          <div className="text-[#888] text-[10px]">
            mediums
          </div>
          <div className="space-y-0.5 text-[#222]">
            <div>Bronze & Castings</div>
            <div>Carrara Marble</div>
            <div>Syrian Basalt</div>
            <div>Terracotta & Clay</div>
            <div>Jewelry & Silver</div>
          </div>
        </div>
      </div>

      {/* Contact Section at bottom */}
      <div className="pt-6 border-t border-[#f0f0f0] space-y-1.5">
        <div className="text-[#888] text-[10px]">
          contact
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[#111]">
          <a 
            href="https://www.ghazwanallaf.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-50 transition-opacity"
          >
            ghazwanallaf.com
          </a>
          <a 
            href="https://www.artsy.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-50 transition-opacity"
          >
            Artsy
          </a>
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-50 transition-opacity"
          >
            Instagram
          </a>
        </div>
      </div>

    </aside>
  )
}
