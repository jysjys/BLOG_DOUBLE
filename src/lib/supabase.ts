import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 获取当前用户会话
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 退出登录
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}