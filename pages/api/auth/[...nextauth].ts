import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

import bcrypt from 'bcrypt';

import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { clientPromise, DBClient } from '@utils/server';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Admin } from '@models';

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
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      credentials: {
        name: { label: 'name', type: 'text' },
        email: {
          label: 'email',
          type: 'text',
          placeholder: 'test@test.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) throw new Error('Missing credentials');

        await DBClient();
        try {
          const admin = await Admin.findOne({ email }).select('+password');

          if (!admin) {
            throw new Error('Wrong email');
          }

          const isPasswordSame = await bcrypt.compare(password, admin.password);

          if (!isPasswordSame) {
            throw new Error('Wrong password');
          }
          const access_token = await admin.generateToken();

          return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            image: admin.image,
            access_token,
          };
        } catch (error) {
          console.log('AUTH ERROR', error);
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    //handles the redirect after successful signin
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
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
      // persist the OAuth access_token and or the user id to the token right after signin
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          image: session.user.image ?? null,
          access_token: token.access_token,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export default handler;
