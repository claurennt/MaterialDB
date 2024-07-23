import { TextEncoder, TextDecoder } from 'util';

export const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

Object.assign(global, { TextDecoder, TextEncoder });
export const BASE_URL =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:3000'
    : 'https://material-db.vercel.app';
