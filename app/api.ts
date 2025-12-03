const API_URL = 'https://serv-ynsd.onrender.com'

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error('API request failed')
  }

  return response.json()
}

export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: any) =>
    fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => fetchAPI('/api/auth/me'),
}

export const postsAPI = {
  getPosts: () => fetchAPI('/api/posts'),
  
  createPost: (content: string) =>
    fetchAPI('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  likePost: (postId: string) =>
    fetchAPI(`/api/posts/${postId}/like`, { method: 'POST' }),
}
