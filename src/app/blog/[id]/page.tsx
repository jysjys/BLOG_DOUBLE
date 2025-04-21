import { notFound } from 'next/navigation'

export default function BlogPost({ params }: { params: { id: string } }) {
  // TODO: Fetch blog post by ID from API
  const post = {
    id: params.id,
    title: 'Sample Post',
    content: 'This is the content of the blog post.',
    date: '2023-01-01'
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-8">{post.date}</p>
      <div className="prose max-w-none">
        {post.content}
      </div>
    </div>
  )
}