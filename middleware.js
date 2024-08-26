import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(req) {
  const token = req.cookies.get('token');

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (token === undefined) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}