'use client';
import { useState } from 'react';
import { posts } from '../api';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await posts.createPost(content);
      setContent('');
      if (onPostCreated) onPostCreated();
      alert('Post publié !');
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Partagez quelque chose..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
          rows="3"
        />
        <div style={styles.footer}>
          <div style={styles.buttons}>
            <button type="button" style={styles.iconButton}>📷</button>
            <button type="button" style={styles.iconButton}>🎥</button>
            <button type="button" style={styles.iconButton}>📎</button>
          </div>
          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading || !content.trim()}
          >
            {loading ? 'Publication...' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  textarea: {
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '16px',
    resize: 'vertical',
    marginBottom: '15px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666',
  },
  submitButton: {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
