'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'

interface User {
  id: string
  email?: string
}

const navigation = [
  { name: '首页', href: '/', icon: '🏠' },
  { name: '宠物管理', href: '/pets', icon: '🐶' },
  { name: '待办事项', href: '/todo', icon: '📝' },
  { name: '博客', href: '/blog', icon: '📝' }, 
]

export default function Sidebar() {
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* Sidebar for mobile */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex h-full flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">宠物管理系统</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {user?.email || '未登录'}
                  </div>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      window.location.href = '/auth/login'
                    }}
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">宠物管理系统</h1>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <div className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      {user?.email || '未登录'}
                    </div>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        window.location.href = '/auth/login'
                      }}
                      className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}