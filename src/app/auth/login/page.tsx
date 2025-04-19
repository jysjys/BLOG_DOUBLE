'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [origin, setOrigin] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          throw sessionError
        }
        if (session) {
          const searchParams = new URLSearchParams(window.location.search)
          const redirectTo = searchParams.get('redirectTo') || '/'
          router.push(redirectTo)
        }
      } catch (err) {
        console.error('Session check error:', err)
        setError('登录状态检查失败，请刷新页面重试')
      } finally {
        setLoading(false)
      }
    }
    checkSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const searchParams = new URLSearchParams(window.location.search)
        const redirectTo = searchParams.get('redirectTo') || '/'
        router.push(redirectTo)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : (
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            localization={{
              variables: {
                sign_in: {
                  email_label: '邮箱',
                  password_label: '密码',
                  email_input_placeholder: '请输入邮箱',
                  password_input_placeholder: '请输入密码',
                  button_label: '登录',
                  loading_button_label: '登录中...',
                  social_provider_text: '使用 {{provider}} 登录',
                  link_text: '已有账号？登录'
                }
              }
            }}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#404040',
                    brandAccent: '#000000',
                    inputBackground: 'white',
                    inputBorder: '#e5e7eb',
                    inputBorderHover: '#d1d5db',
                    inputBorderFocus: '#9ca3af'
                  }
                }
              },
              className: {
                container: 'w-full',
                button: 'rounded-lg transition-all duration-200 hover:opacity-90',
                input: 'rounded-lg border-gray-200 focus:ring-2 focus:ring-gray-200'
              }
            }}
            providers={['github', 'google']}
            redirectTo={`${origin}/auth/callback`}
          />
        )}
      </div>
    </div>
  )
}