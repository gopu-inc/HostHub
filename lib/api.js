const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fonction fetch avec auth
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  return response.json();
}

// Auth
export const auth = {
  login: (email, password) => 
    fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  register: (userData) => 
    fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  getMe: () => fetchAPI('/api/auth/me')
};

// Posts
export const posts = {
  getFeed: () => fetchAPI('/api/posts'),
  createPost: (content, media) => {
    const formData = new FormData();
    formData.append('content', content);
    if (media) formData.append('media', media);
    
    return fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
  },
  likePost: (postId) => 
    fetchAPI(`/api/posts/${postId}/like`, { method: 'POST' })
};

// Users
export const users = {
  getUser: (userId) => fetchAPI(`/api/users/${userId}`),
  follow: (userId) => 
    fetchAPI(`/api/users/${userId}/follow`, { method: 'POST' })
};

// Messages
export const messages = {
  getConversations: () => fetchAPI('/api/messages'),
  sendMessage: (receiverId, content) =>
    fetchAPI('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId, content })
    })
};

// Code snippets
export const code = {
  getSnippets: () => fetchAPI('/api/code'),
  createSnippet: (data) =>
    fetchAPI('/api/code', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};
