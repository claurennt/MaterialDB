import { NextApiRequest, NextApiResponse } from 'next';
import { DefaultSession } from 'next-auth';

import { Admin } from './pages';
import { ITopic } from './mongoose';

type User = {
  name: string;
  email: string;
  image: string;
  access_token?: string;
  id: string;
  topics: [] | ITopic[];
} & DefaultSession['user'];
//module augmentation for Session

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
}

export type NextAPIHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  query?: { [key: string]: string }
) => void | Promise<void> | any | Promise<Admin>;
