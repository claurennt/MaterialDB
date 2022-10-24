// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSession, Session } from 'next-iron-session';
import type { NextIronHandler } from '../../types/next-auth';

const withSession = (handler: NextIronHandler) =>
  withIronSession(handler, {
    password: process.env.NEXT_PUBLIC_SECRET_COOKIE_PASSWORD,
    cookieName: process.env.NEXT_PUBLIC_NAMESPACE,
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  });

export default withSession;
