import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // getToken uses the same secret from your authOptions automatically
  const token = await getToken({ req });
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

  if (isAuthPage) {
    if (token) {
      // User is logged in, send them home
      return NextResponse.redirect(new URL('/', req.url));
    }
    // No token? Let them stay on the login/register page
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/login', '/auth/register'],
};
