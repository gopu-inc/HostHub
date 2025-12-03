import api from './config'
import { Post, PostCreate, PostUpdate, Comment, CommentCreate } from '@/types/post'

export const getPosts = async (params?: {
  user_id?: string
  hashtag?: string
  limit?: number
  offset?: number
}): Promise<Post[]> => {
  const response = await api.get('/api/posts', { params })
  return response.data
}

export const getPost = async (postId: string): Promise<Post> => {
  const response = await api.get(`/api/posts/${postId}`)
  return response.data
}

export const createPost = async (postData: PostCreate): Promise<Post> => {
  const formData = new FormData()
  formData.append('content', postData.content)
  formData.append('is_public', postData.is_public.toString())
  
  if (postData.media_urls && postData.media_urls.length > 0) {
    postData.media_urls.forEach((url, index) => {
      formData.append(`media_urls[${index}]`, url)
    })
  }
  
  if (postData.hashtags && postData.hashtags.length > 0) {
    formData.append('hashtags', postData.hashtags.join(','))
  }
  
  const response = await api.post('/api/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const updatePost = async (postId: string, postData: PostUpdate): Promise<Post> => {
  const response = await api.put(`/api/posts/${postId}`, postData)
  return response.data
}

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/api/posts/${postId}`)
}

export const likePost = async (postId: string): Promise<{ liked: boolean }> => {
  const response = await api.post(`/api/posts/${postId}/like`)
  return response.data
}

export const getPostLikes = async (postId: string, params?: {
  limit?: number
  offset?: number
}): Promise<any[]> => {
  const response = await api.get(`/api/posts/${postId}/likes`, { params })
  return response.data
}

export const createComment = async (commentData: CommentCreate): Promise<Comment> => {
  const response = await api.post('/api/comments', commentData)
  return response.data
}

export const getPostComments = async (postId: string, params?: {
  limit?: number
  offset?: number
}): Promise<Comment[]> => {
  const response = await api.get(`/api/posts/${postId}/comments`, { params })
  return response.data
}

export const getTrendingPosts = async (timeframe: 'day' | 'week' | 'month' = 'day', limit: number = 20): Promise<Post[]> => {
  const response = await api.get('/api/explore/trending', {
    params: { timeframe, limit }
  })
  return response.data
}
