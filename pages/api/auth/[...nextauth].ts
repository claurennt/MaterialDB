import { sendAuthRequest } from 'utils/client/auth';
import axios from 'axios';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from 'utils/server/clientPromise';
import CredentialsProvider from 'next-auth/providers/credentials';
import Admin from 'models/Admin';
import dbConnect from 'utils/server/DBClient';
import Topic from 'models/Topic';
import { getToken } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      id: 'username-login',
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        name: { label: 'name', type: 'text' },
        email: { label: 'email', type: 'text', placeholder: 'test@test.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        if (!email || !password) throw new Error('Missing credentials');
        try {
          await dbConnect();
          const admin = await Admin.findOne({ email }).select('+password');

          if (!admin) {
            return null;
          }

          const isPasswordSame = await bcrypt.compare(password, admin.password);

          if (!isPasswordSame) {
            throw new Error('The passwords do not match');
          }

          return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            image: admin.image,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, session }) {
      // if (!session?.user.image) session.user.image = null;
      // user is defined only immediately after signin in
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      // persist the OAuth access_token and or the user id to the token right after signin
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          image: session.user.image ?? null,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export default handler;
