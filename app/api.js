// Configuration
const API_URL = 'https://serv-ynsd.onrender.com';

// Fonction fetch générique
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('hosthub_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Erreur API');
  }
  
  return response.json();
}

// Authentification
export const auth = {
  login: (email, password) => 
    fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  register: (username, email, password) => 
    fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    }),
  
  getMe: () => fetchAPI('/api/auth/me')
};

// Posts
export const posts = {
  getFeed: () => fetchAPI('/api/posts'),
  
  createPost: (content) => 
    fetchAPI('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content })
    }),
  
  likePost: (postId) => 
    fetchAPI(`/api/posts/${postId}/like`, { method: 'POST' })
};

// Utilisateurs
export const users = {
  getUser: (userId) => fetchAPI(`/api/users/${userId}`),
  
  follow: (userId) => 
    fetchAPI(`/api/users/${userId}/follow`, { method: 'POST' })
};

// Messages
export const messages = {
  getConversations: () => fetchAPI('/api/messages')
};
