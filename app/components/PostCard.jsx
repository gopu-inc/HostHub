'use client';
import { useState } from 'react';
import { posts } from '../api';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);

  const handleLike = async () => {
    try {
      await posts.likePost(post.id);
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <img 
          src={post.user?.avatar_url || '/default-avatar.png'} 
          style={styles.avatar}
          alt={post.user?.username}
        />
        <div style={styles.userInfo}>
          <strong style={styles.username}>{post.user?.username}</strong>
          <span style={styles.date}>
            {new Date(post.created_at).toLocaleDateString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
      
      <p style={styles.content}>{post.content}</p>
      
      {post.media_urls && post.media_urls.length > 0 && (
        <img 
          src={post.media_urls[0]} 
          style={styles.media}
          alt="Post media"
        />
      )}
      
      <div style={styles.actions}>
        <button onClick={handleLike} style={styles.actionButton}>
          {liked ? '❤️' : '🤍'} {likes}
        </button>
        <button style={styles.actionButton}>
          💬 {post.comments_count || 0}
        </button>
        <button style={styles.actionButton}>
          🔗 {post.shares_count || 0}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  username: {
    fontSize: '16px',
  },
  date: {
    fontSize: '12px',
    color: '#666',
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '15px',
  },
  media: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  actions: {
    display: 'flex',
    gap: '15px',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
};
