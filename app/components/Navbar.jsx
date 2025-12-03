'use client';
import { useRouter } from 'next/navigation';

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('hosthub_token');
    localStorage.removeItem('hosthub_user');
    router.push('/auth/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <a href="/dashboard" style={styles.logo}>
          🚀 HostHub
        </a>
        
        <div style={styles.search}>
          <input
            type="text"
            placeholder="Rechercher..."
            style={styles.searchInput}
          />
        </div>
        
        <div style={styles.right}>
          {user && (
            <a href="/dashboard/profile" style={styles.user}>
              <img 
                src={user.avatar_url || '/default-avatar.png'} 
                style={styles.userAvatar}
                alt={user.username}
              />
              <span>{user.username}</span>
            </a>
          )}
          <button onClick={handleLogout} style={styles.logoutButton}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: '#4f46e5',
    color: 'white',
    padding: '10px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  search: {
    flex: 1,
    maxWidth: '400px',
    margin: '0 20px',
  },
  searchInput: {
    width: '100%',
    padding: '8px 15px',
    borderRadius: '20px',
    border: 'none',
    outline: 'none',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'white',
    textDecoration: 'none',
  },
  userAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
  },
  logoutButton: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
