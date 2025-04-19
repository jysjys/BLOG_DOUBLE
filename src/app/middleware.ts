import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 需要登录才能访问的路由
  const protectedRoutes = [
    '/',
    '/pets',
    '/todo'
  ]

  try {
    const { data: { session } } = await supabase.auth.getSession()
    // 如果获取session失败，视为未登录
    if (!session) {
      console.log('No session found')
    }

    // 检查当前路由是否需要登录
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // 如果是受保护的路由且用户未登录，重定向到登录页面
    if (isProtectedRoute && !session) {
      console.log('Redirecting to login page from:', req.nextUrl.pathname)
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // 如果用户已登录且尝试访问登录页面，重定向到首页
    if (session && req.nextUrl.pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return res
  } catch (error) {
    console.error('Error in middleware:', error)
    // 发生错误时，如果是受保护路由则重定向到登录页面
    if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }
}

// 配置中间件匹配规则
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (favicon文件)
     * - public文件夹
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}