/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  // Enable CSS optimization
  experimental: {
    optimizeCss: true,
  },
  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      'postcss': 'postcss',
    },
  },
}

module.exports = nextConfig
