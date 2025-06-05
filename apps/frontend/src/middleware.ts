import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('Middleware running for:', pathname) // Debug log
  
  // Allow access to the root route ('/') without authentication
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // Check for session cookie (Better Auth typically uses 'better-auth.session_token' or similar)
  const sessionCookie = request.cookies.get('better-auth.session_token') || 
                       request.cookies.get('session') ||
                       request.cookies.get('authjs.session-token')
  
  console.log('Session cookie found:', !!sessionCookie) // Debug log
  
  // If no session cookie exists, redirect to root
  if (!sessionCookie) {
    console.log('No session found, redirecting to /') // Debug log
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // If session cookie exists, allow access to the route
  console.log('Session found, allowing access') // Debug log
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
