const { environment, PORT, NEXT_PUBLIC_URL, NEXTAUTH_SECRET, NEXTAUTH_URL } =
  process.env;
const port = PORT || 3000;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '/ios-filled/50/fd5244/**',
      },
    ],
  },
  env: {
    NEXTAUTH_SECRET,
    NEXT_PUBLIC_URL,
    REQUEST_URL:
      environment === 'development'
        ? `http://localhost:${port}/api`
        : `${NEXT_PUBLIC_URL}/api`,
  },
};
module.exports = nextConfig;
