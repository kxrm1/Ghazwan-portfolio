'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Project } from '@/data/projects'
import PlaceholderImage from './PlaceholderImage'

interface ProjectRowProps {
  project: Project
  index: number
}

export default function ProjectRow({ project, index }: ProjectRowProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full pt-10 pb-16 md:pt-14 md:pb-24 border-t border-[#f0f0f0] last:border-b"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Project Metadata Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-2 gap-x-4 mb-5 md:mb-6 text-[11px] md:text-[12px] tracking-tight leading-tight">
          {/* Title / Link */}
          <div className="md:col-span-4">
            <Link 
              href={`/${project.slug}`}
              className="font-normal text-[#111] hover:opacity-50 transition-opacity inline-flex items-center gap-1.5"
            >
              <span>{project.title}</span>
            </Link>
          </div>

          {/* Category */}
          <div className="md:col-span-4 flex flex-wrap gap-x-1.5 text-[#666]">
            <span className="text-[#999]">Category:</span>
            <span className="text-[#333]">{project.category}</span>
          </div>

          {/* Services */}
          <div className="md:col-span-4 flex flex-wrap gap-x-1.5 text-[#666]">
            <span className="text-[#999]">Services:</span>
            <span className="text-[#333]">{project.services}</span>
          </div>
        </div>

        {/* Project Visuals Row (Grey Placeholders) */}
        <Link href={`/${project.slug}`} className="block group">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 items-start">
            {project.homeImages.map((_, imgIndex) => (
              <div 
                key={imgIndex} 
                className={`overflow-hidden transition-transform duration-500 ease-out group-hover:opacity-95 ${
                  project.homeImages.length === 2 && imgIndex === 1 ? 'md:col-start-3' : ''
                }`}
              >
                <PlaceholderImage 
                  aspectRatio="aspect-[4/5]"
                  label={`${project.title} [${imgIndex + 1}]`}
                />
              </div>
            ))}
          </div>
        </Link>
      </div>
    </motion.section>
  )
}
