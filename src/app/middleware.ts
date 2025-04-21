'use client'

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session && req.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    if (session && req.nextUrl.pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/app', req.url))
    }
  } catch (error) {
    console.warn('Error in middleware:', error)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}