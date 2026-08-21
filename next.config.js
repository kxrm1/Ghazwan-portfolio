/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.rmcdn.net' },
      { protocol: 'https', hostname: '**.rmcdn1.net' },
      { protocol: 'https', hostname: 'i.ytimg.com' }
    ],
  },
}

module.exports = nextConfig
