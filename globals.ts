import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '/.env') });

const PORT = process.env.PORT || '3000';
const HOSTNAME = 'localhost';
export const PROJECT_URL = 'https://material-db.vercel.app/';

export const BASE_URL = process.env.BASE_URL ?? `http://${HOSTNAME}:${PORT}`;

export const AUTH_FILE = path.join(__dirname, '/e2e/utils/user.json');
