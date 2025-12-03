'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { auth, users } from '../../api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await auth.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div>
      <Navbar user={user} />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.cover}>
            <img 
              src={user.cover_url || 'https://via.placeholder.com/1200x300/4f46e5/ffffff'} 
              style={styles.coverImage}
              alt="Cover"
            />
          </div>
          
          <div style={styles.profileInfo}>
            <img 
              src={user.avatar_url || '/default-avatar.png'} 
              style={styles.profileAvatar}
              alt={user.username}
            />
            
            <div style={styles.profileDetails}>
              <h1 style={styles.name}>{user.full_name || user.username}</h1>
              <p style={styles.bio}>{user.bio || 'Aucune bio'}</p>
              <p style={styles.email}>📧 {user.email}</p>
              
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
                  <span>Publications</span>
                </div>
              </div>
              
              <button style={styles.editButton}>
                ✏️ Modifier le profil
              </button>
            </div>
          </div>
        </div>
        
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>Mes publications récentes</h2>
          <p style={{ textAlign: 'center', color: '#666' }}>
            Les publications apparaîtront ici...
          </p>
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
  header: {
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  cover: {
    height: '200px',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileInfo: {
    padding: '0 30px 30px',
    position: 'relative',
    marginTop: '-60px',
  },
  profileAvatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '5px solid white',
    background: 'white',
  },
  profileDetails: {
    marginTop: '10px',
  },
  name: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '10px 0 5px',
  },
  bio: {
    fontSize: '16px',
    color: '#666',
    margin: '5px 0',
  },
  email: {
    color: '#888',
    margin: '5px 0 20px',
  },
  stats: {
    display: 'flex',
    gap: '30px',
    margin: '20px 0',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  editButton: {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  content: {
    background: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
};
