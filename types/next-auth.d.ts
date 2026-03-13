import { NextApiRequest, NextApiResponse } from 'next';
import { DefaultSession } from 'next-auth';

import { Admin } from './pages';
import { ITopic } from './mongoose';

import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      access_token?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username: string;
    access_token?: string;
  }
}
