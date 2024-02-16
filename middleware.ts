import { NextResponse, NextRequest } from 'next/server';
import * as jose from 'jose';
import { SECRET } from 'utils/globals';

// middlewares use the edge runtime so we can't use jsonwebtoken module because it is using crypto, so we need jose
export async function middleware(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization');
    const { payload } = await jose.jwtVerify(token, SECRET);

    if (!token || !payload)
      return NextResponse.json(
        { error: 'Bad request: invalid token' },
        { status: 401 }
      );

    return NextResponse.next();
  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 400 }
    );
  }
}

export const config = {
  matcher: ['/api/topics/:path*', '/api/links/:path*', '/api/admin/:path*'],
};
