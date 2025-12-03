'use client'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import { postsAPI } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await postsAPI.getPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to access the dashboard</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <CreatePost onPostCreated={loadPosts} />
          
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
