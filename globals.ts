export const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export const BASE_URL = !process.env.NODE_ENV
  ? 'http://localhost:3000'
  : 'https://material-db.vercel.app';
