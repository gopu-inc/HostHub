'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { posts, auth } from '../api';

export default function DashboardPage() {
  const router = useRouter();
  const [feed, setFeed] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    loadFeed();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('hosthub_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    try {
      const userData = await auth.getMe();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('hosthub_token');
      router.push('/auth/login');
    }
  };

  const loadFeed = async () => {
    try {
      const data = await posts.getFeed();
      setFeed(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!user) return <div style={{ padding: '20px' }}>Chargement...</div>;

  return (
    <div>
      <Navbar user={user} />
      
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <div style={styles.userCard}>
            <img 
              src={user.avatar_url || '/default-avatar.png'} 
              style={styles.avatar}
              alt={user.username}
            />
            <h3 style={styles.username}>{user.username}</h3>
            <p style={styles.email}>{user.email}</p>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <strong>{user.followers_count || 0}</strong>
                <span>Abonnés</span>
              </div>
              <div style={styles.stat}>
                <strong>{user.following_count || 0}</strong>
                <span>Abonnements</span>
              </div>
              <div style={styles.stat}>
                <strong>{user.posts_count || 0}</strong>
                <span>Posts</span>
              </div>
            </div>
          </div>
          
          <div style={styles.menu}>
            <a href="/dashboard" style={styles.menuItem}>🏠 Accueil</a>
            <a href="/dashboard/profile" style={styles.menuItem}>👤 Mon profil</a>
            <a href="/dashboard/explore" style={styles.menuItem}>🔍 Explorer</a>
            <a href="/dashboard/messages" style={styles.menuItem}>💬 Messages</a>
          </div>
        </div>
        
        <div style={styles.main}>
          <CreatePost onPostCreated={loadFeed} />
          
          <div style={styles.feed}>
            {feed.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>
                Aucun post à afficher. Suivez des personnes pour voir leur contenu.
              </p>
            ) : (
              feed.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    gap: '20px',
  },
  sidebar: {
    width: '250px',
  },
  userCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    margin: '0 auto 10px',
  },
  username: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 5px',
  },
  email: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 15px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
  },
  menu: {
    marginTop: '20px',
    background: 'white',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  menuItem: {
    display: 'block',
    padding: '10px',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '5px',
    marginBottom: '5px',
  },
  main: {
    flex: 1,
  },
  feed: {
    marginTop: '20px',
  },
};
