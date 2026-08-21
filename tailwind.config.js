/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1c1c1c',
        muted: '#808080',
        subtle: '#b0b0b0',
        border: '#e5e5e5',
        hoverGray: '#f4f4f4'
      },
      fontFamily: {
        sans: ['var(--font-geist-mono)', 'monospace'],
        serif: ['var(--font-geist-mono)', 'monospace'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.05em',
        widest: '0.1em',
      }
    },
  },
  plugins: [],
}
