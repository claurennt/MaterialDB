import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { Session } from 'next-iron-session';
import { Admin } from './pages';
//module augmentation for Session
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    admin: Admin;
  }
}

export type NextAPIHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  query?: { [key: string]: string }
) => void | Promise<void> | any | Promise<Admin>;
