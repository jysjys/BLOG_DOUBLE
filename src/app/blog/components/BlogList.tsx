import Link from 'next/link'

export default function BlogList() {
  // TODO: Fetch blog posts from API
  const posts = [
    { id: '1', title: 'First Post', excerpt: 'This is the first blog post' },
    { id: '2', title: 'Second Post', excerpt: 'This is the second blog post' },
  ]

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-semibold mb-2">
            <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-600">{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}