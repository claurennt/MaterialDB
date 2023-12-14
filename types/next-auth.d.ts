import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { DefaultSession } from 'next-auth';

import { Admin } from './pages';
import { ITopic } from './mongoose';
//module augmentation for Session

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    expires: string;
    user: {
      id: string;
      topics: [] | ITopic[];
    } & DefaultSession['user'];
  }
}

export type NextAPIHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  query?: { [key: string]: string }
) => void | Promise<void> | any | Promise<Admin>;
