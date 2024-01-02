import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

import bcrypt from 'bcrypt';

import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from 'utils/server/clientPromise';
import CredentialsProvider from 'next-auth/providers/credentials';
import Admin from 'models/Admin';
import dbConnect from 'utils/server/DBClient';

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

      credentials: {
        name: { label: 'name', type: 'text' },
        email: { label: 'email', type: 'text', placeholder: 'test@test.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) throw new Error('Missing credentials');

        await dbConnect();
        try {
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
          console.log('authorize', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user is defined only immediately after signin in
      if (user) {
        return {
          ...token,
          ...user,
          id: user.id,
          email: user.email,
        };
      }

      return token;
    },
    async session({ session, token }) {
      try {
        await dbConnect();

        const admin = await (
          await Admin.findOne({ email: token.email })
        ).populate('topics');

        if (!admin) {
          return null;
        }

        // persist the OAuth access_token and or the user id to the token right after signin
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            email: token.email,
            picture: session.user.image ?? null,
            topics: admin?.topics,
          },
        };
      } catch (err) {
        console.log('session', err);
        return null;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export default handler;
