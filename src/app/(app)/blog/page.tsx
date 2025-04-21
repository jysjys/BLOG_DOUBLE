'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  created_at: string
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching posts:', error)
          setError(error.message)
          return
        }

        if (!data) {
          setPosts([])
          return
        }

        setPosts(data)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred while fetching posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link
          href="/blog/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No posts found. Create your first post!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">
                {post.content.substring(0, 100)}...
              </p>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}