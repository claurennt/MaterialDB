const {
  PORT,
  NEXT_PUBLIC_AUTH_SECRET,
  NEXT_PUBLIC_URL,
  NEXTAUTH_URL,
  NEXT_PUBLIC_EMAIL,
  NEXT_PUBLIC_PASSWORD,
  NEXT_PUBLIC_MONGODB_URI,
} = process.env;
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
    NEXT_PUBLIC_AUTH_SECRET,
    NEXT_PUBLIC_URL,
    NEXTAUTH_URL,
    NEXT_PUBLIC_EMAIL,
    NEXT_PUBLIC_PASSWORD,
    NEXT_PUBLIC_MONGODB_URI,
  },
};
module.exports = nextConfig;
