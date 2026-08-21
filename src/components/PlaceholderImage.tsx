'use client'

import React, { useState } from 'react'

interface PlaceholderProps {
  aspectRatio?: string
  className?: string
  imageClassName?: string
  objectFit?: 'cover' | 'contain'
  label?: string
  src?: string
  alt?: string
  priority?: boolean
  fetchPriority?: 'high' | 'low' | 'auto'
}

export default function PlaceholderImage({ 
  aspectRatio = 'aspect-[4/5]', 
  className = '', 
  imageClassName = '',
  objectFit = 'cover',
  label = '',
  src,
  alt = 'Artwork image',
  priority = false,
  fetchPriority
}: PlaceholderProps) {
  const [imgError, setImgError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover'
  const computedFetchPriority = fetchPriority || (priority ? 'high' : 'auto')

  if (src && !imgError) {
    return (
      <div className={`w-full overflow-hidden bg-white relative flex items-center justify-center ${aspectRatio} ${className}`}>
        {/* Subtle ultra-light background while image loads to prevent layout shift */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#fafafa] animate-pulse" />
        )}
        <img
          src={src}
          alt={alt || label}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={computedFetchPriority}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImgError(true)}
          className={`w-full h-full transition-opacity duration-300 ease-out group-hover:scale-[1.02] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${fitClass} ${imageClassName}`}
        />
      </div>
    )
  }

  return (
    <div 
      className={`w-full bg-[#f6f6f6] flex items-center justify-center text-[#999] text-[10px] font-mono select-none transition-colors duration-300 ${aspectRatio} ${className}`}
    >
      {label && <span className="opacity-60 text-center px-2">{label}</span>}
    </div>
  )
}
