/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'appDir' - it's now default in Next.js 16
  
  // Set the correct root directory for Turbopack
  turbopack: {
    root: __dirname,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // React strict mode
  reactStrictMode: true,
  
  // Security
  poweredByHeader: false,
}

module.exports = nextConfig
