import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistMono = localFont({
  src: [
    {
      path: './fonts/GeistMono-Variable.woff2',
      style: 'normal',
    },
    {
      path: './fonts/GeistMono-Italic[wght].woff2',
      style: 'italic',
    },
  ],
  variable: '--font-geist-mono',
})

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
    <html lang="en" className={geistMono.variable}>
      <body className={`${geistMono.className} bg-white text-[#1c1c1c] antialiased selection:bg-[#a2a2a2] selection:text-white`}>
        {children}
      </body>
    </html>
  )
}
