import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ghazwan Allaf — Sculptor, Educator & Visual Artist',
  description: 'Portfolio of Ghazwan Allaf: Syrian sculptor and educator specializing in anatomy, contemporary sculpture, and fine arts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1c1c1c] antialiased selection:bg-[#a2a2a2] selection:text-white font-serif">
        {children}
      </body>
    </html>
  )
}
