import { Suspense } from 'react'
import BlogList from './components/BlogList'

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogList />
      </Suspense>
    </div>
  )
}