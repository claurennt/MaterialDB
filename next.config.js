/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
  },

  images: {
    unoptimized:
      process.env.NODE_ENV !== 'production' || Boolean(process.env.CI),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '/ios-filled/50/fd5244/**',
      },
    ],
  },
};

module.exports = nextConfig;
