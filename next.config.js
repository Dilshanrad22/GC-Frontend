/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
  experimental: {
    serverActions: {
      // Default is 1mb, which a phone photo blows past instantly — product/category
      // image uploads go through Server Actions (actions/products.ts), so this must be
      // comfortably above the backend's own MAX_FILE_SIZE (GC_BE/.env, default 5MB).
      bodySizeLimit: '8mb',
    },
  },
};

module.exports = nextConfig;
