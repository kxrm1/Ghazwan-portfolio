'use client'

import React, { useState } from 'react'

interface PlaceholderProps {
  aspectRatio?: string
  className?: string
  label?: string
  src?: string
  alt?: string
}

export default function PlaceholderImage({ 
  aspectRatio = 'aspect-[4/5]', 
  className = '', 
  label = '',
  src,
  alt = 'Artwork image'
}: PlaceholderProps) {
  const [imgError, setImgError] = useState(false)

  if (src && !imgError) {
    return (
      <div className={`w-full overflow-hidden bg-[#fafafa] relative ${aspectRatio} ${className}`}>
        <img
          src={src}
          alt={alt || label}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>
    )
  }

  return (
    <div 
      className={`w-full bg-[#ebebeb] flex items-center justify-center text-[#999] text-[11px] font-mono select-none transition-colors duration-300 hover:bg-[#e2e2e2] ${aspectRatio} ${className}`}
    >
      {label && <span className="opacity-60 text-center px-3">{label}</span>}
    </div>
  )
}
