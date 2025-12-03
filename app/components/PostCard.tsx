'use client'
import { useState } from 'react'
import { postsAPI } from '../api'

interface PostCardProps {
  post: {
    id: string
    content: string
    user: {
      username: string
      avatar_url?: string
    }
    likes_count: number
    comments_count: number
    created_at: string
  }
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes_count)

  const handleLike = async () => {
    try {
      await postsAPI.likePost(post.id)
      setLiked(!liked)
      setLikes(liked ? likes - 1 : likes + 1)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex items-center mb-4">
        <img
          src={post.user.avatar_url || '/default-avatar.png'}
          alt={post.user.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-bold">{post.user.username}</h3>
          <p className="text-gray-500 text-sm">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <p className="mb-4">{post.content}</p>
      
      <div className="flex space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            liked ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <span>❤️</span>
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-500">
          <span>💬</span>
          <span>{post.comments_count}</span>
        </button>
      </div>
    </div>
  )
}
