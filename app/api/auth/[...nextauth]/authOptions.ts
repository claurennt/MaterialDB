// app/api/auth/[...nextauth]/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Admin } from '@models';

import { DBClient } from '../../../../lib/server/DBClient';
import { clientPromise } from '../../../../lib/server/clientPromise';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/auth/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'name', type: 'text' },
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error('Missing credentials');

        await DBClient();
        const admin = await Admin.findOne({ email: credentials.email }).select(
          '+password',
        );

        if (!admin) throw new Error('Wrong email');

        const isPasswordSame = await bcrypt.compare(
          credentials.password,
          admin.password,
        );
        if (!isPasswordSame) throw new Error('Wrong password');

        const access_token = await admin.generateToken();

        // FIX: Ensure id is a string and use fallbacks for optional fields
        return {
          id: admin._id.toString(), // TypeScript now sees this is executed after admin check
          name: admin.name || 'Admin',
          email: admin.email,
          image: admin.image || null,
          access_token: access_token!, // Use ! if you're sure it exists, or provide fallback
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
          id: token.id,
          email: token.email,
          access_token: token.access_token,
        },
      };
    },
  },
};
