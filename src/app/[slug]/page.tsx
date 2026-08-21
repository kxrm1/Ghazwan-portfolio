import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROJECTS } from '@/data/projects'
import HeroSlideshow from '@/components/HeroSlideshow'
import PlaceholderImage from '@/components/PlaceholderImage'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }))
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectIndex = PROJECTS.findIndex((p) => p.slug === params.slug)
  if (projectIndex === -1) {
    notFound()
  }

  const project = PROJECTS[projectIndex]
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length]
  const prevProject = PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length]

  return (
    <main className="min-h-screen bg-white text-[#1c1c1c] pb-24 font-serif">
      {/* Top Header */}
      <header className="w-full pt-6 pb-10 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-4 mb-8 md:mb-12">
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

        {/* Breadcrumb / Back */}
        <div className="border-t border-[#f0f0f0] pt-4">
          <Link href="/" className="text-[12px] md:text-[13px] text-[#888] hover:text-[#111] transition-colors">
            ← Artworks Index
          </Link>
        </div>
      </header>

      {/* Project Meta Information Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 mb-14 md:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-6 text-[13px] md:text-[14px] tracking-tight leading-[1.5]">
          {/* Project Title */}
          <div className="md:col-span-4 space-y-1">
            <h1 className="text-[17px] md:text-[19px] font-normal text-[#111]">
              {project.title}
            </h1>
            <div className="text-[12px] text-[#999]">
              [{project.tag}]
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-5 space-y-4 text-[#333] pr-0 md:pr-6">
            {project.description.map((para, i) => (
              <p key={i} className="leading-[1.6]">
                {para}
              </p>
            ))}
          </div>

          {/* Metadata attributes */}
          <div className="md:col-span-3 space-y-4 text-[12px] md:text-[13px]">
            <div>
              <span className="text-[#999] block mb-0.5">Category:</span>
              <span className="text-[#111]">{project.category}</span>
            </div>
            <div>
              <span className="text-[#999] block mb-0.5">Services:</span>
              <span className="text-[#111]">{project.services}</span>
            </div>
            <div>
              <span className="text-[#999] block mb-0.5">Year:</span>
              <span className="text-[#111]">{project.year}</span>
            </div>
            {project.credits && (
              <div>
                <span className="text-[#999] block mb-0.5">Credits:</span>
                <span className="text-[#555]">{project.credits}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Embed Placeholder if video */}
      {project.videoEmbed && (
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 mb-12">
          <PlaceholderImage 
            aspectRatio="aspect-video" 
            label="Video Area" 
          />
        </div>
      )}

      {/* Visual Gallery with Grey Placeholders */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 space-y-6 md:space-y-10">
        {project.gallery.map((_, i) => (
          <div key={i} className="w-full overflow-hidden">
            <PlaceholderImage 
              aspectRatio={i % 3 === 0 ? "aspect-[16/9]" : i % 2 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"}
              label={`Artwork view ${i + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Bottom Project Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 mt-24 pt-8 border-t border-[#f0f0f0]">
        <div className="flex justify-between items-center text-[12px] md:text-[13px] tracking-tight">
          <Link 
            href={`/${prevProject.slug}`} 
            className="hover:opacity-50 transition-opacity text-[#666] hover:text-[#111]"
          >
            ← {prevProject.title}
          </Link>

          <Link 
            href="/" 
            className="hover:opacity-50 transition-opacity text-[#111] font-medium"
          >
            All Artworks
          </Link>

          <Link 
            href={`/${nextProject.slug}`} 
            className="hover:opacity-50 transition-opacity text-[#666] hover:text-[#111]"
          >
            {nextProject.title} →
          </Link>
        </div>
      </div>
    </main>
  )
}
