import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

const excludedRoutes = ['/', '/login', '/register'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Fetch session and cookie data
  const session: any = await auth();

  // Skip middleware checks for excluded routes
  if (excludedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect user trying to access /admin to /login?u=admin
  if (pathname === '/admin') {
    const url = new URL('/login', req.nextUrl);
    url.searchParams.set('u', 'admin');
    return NextResponse.redirect(url);
  }

  // If user is not verified or not authenticated, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  // Allow request if authenticated and verified
  return NextResponse.next();
}

// Middleware matcher to exclude certain paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
