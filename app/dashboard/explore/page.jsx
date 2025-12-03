'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import PostCard from '../../components/PostCard';
import { posts, auth } from '../../api';

export default function ExplorePage() {
  const [user, setUser] = useState(null);
  const [explorePosts, setExplorePosts] = useState([]);

  useEffect(() => {
    loadUser();
    loadExplore();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await auth.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadExplore = async () => {
    try {
      const data = await posts.getFeed();
      setExplorePosts(data.slice(0, 10)); // Limite à 10 posts
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div>
      <Navbar user={user} />
      
      <div style={styles.container}>
        <h1 style={styles.title}>🔍 Explorer HostHub</h1>
        <p style={styles.subtitle}>Découvrez du contenu intéressant</p>
        
        <div style={styles.filters}>
          <button style={styles.filterActive}>Tendance</button>
          <button style={styles.filter}>Nouveau</button>
          <button style={styles.filter}>Populaire</button>
        </div>
        
        <div style={styles.grid}>
          {explorePosts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', gridColumn: '1/-1' }}>
              Chargement du contenu...
            </p>
          ) : (
            explorePosts.map(post => (
              <div key={post.id} style={styles.gridItem}>
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  },
  filter: {
    background: 'white',
    border: '1px solid #ddd',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  filterActive: {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  gridItem: {
    width: '100%',
  },
};
