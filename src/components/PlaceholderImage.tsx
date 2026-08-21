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
}

export default function PlaceholderImage({ 
  aspectRatio = 'aspect-[4/5]', 
  className = '', 
  imageClassName = '',
  objectFit = 'cover',
  label = '',
  src,
  alt = 'Artwork image'
}: PlaceholderProps) {
  const [imgError, setImgError] = useState(false)

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover'

  if (src && !imgError) {
    return (
      <div className={`w-full overflow-hidden bg-white relative flex items-center justify-center ${aspectRatio} ${className}`}>
        <img
          src={src}
          alt={alt || label}
          loading="lazy"
          onError={() => setImgError(true)}
          className={`w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.02] ${fitClass} ${imageClassName}`}
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
