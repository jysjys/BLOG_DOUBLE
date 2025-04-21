'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  title: string
  content: string
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, setPost] = useState<Post | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (!data) {
        notFound()
      }
      setPost(data)
    }

    fetchPost()
  }, [id, supabase])

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}
