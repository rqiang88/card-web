/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
