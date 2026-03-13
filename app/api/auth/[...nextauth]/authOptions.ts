import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Admin } from '@models';

import { DBClient } from 'app/lib/server/DBClient';

const { NEXTAUTH_SECRET } = process.env;

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/auth/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password)
          throw new Error('Username and password are required.');

        await DBClient();
        const admin = await Admin.findOne({
          username: credentials.username,
        }).select('+password');

        if (!admin) throw new Error('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          admin.password,
        );

        if (!isPasswordValid) throw new Error('Invalid credentials');

        return {
          id: admin._id.toString(),
          username: admin.username,
          email: admin.email,
          image: admin.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id || token.sub,
          email: token.email,
          username: token.username,
          access_token: token.access_token,
        },
      };
    },
  },
};
