import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '/.env') });

export const PORT = process.env.PORT || '3000';
export const HOSTNAME = 'localhost';
export const PROJECT_URL = 'https://material-db.vercel.app/';
export const BASE_URL =
  process.env.CI === 'true' || process.env.NODE_ENV === 'development'
    ? `http://${HOSTNAME}:${PORT}`
    : PROJECT_URL;
