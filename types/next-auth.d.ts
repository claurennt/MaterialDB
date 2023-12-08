import { NextApiRequest, NextApiResponse } from 'next';

import { Admin } from './pages';
//module augmentation for Session
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    expires: string;
    user: { id: string; name: string; email: string; image?: string };
  }
}

export type NextAPIHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  query?: { [key: string]: string }
) => void | Promise<void> | any | Promise<Admin>;
