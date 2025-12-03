'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { messages, auth } from '../../api';

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    loadUser();
    loadConversations();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await auth.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await messages.getConversations();
      setConversations(data.slice(0, 10));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div>
      <Navbar user={user} />
      
      <div style={styles.container}>
        <div style={styles.messagesContainer}>
          {/* Liste des conversations */}
          <div style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>Messages</h2>
            
            {conversations.length === 0 ? (
              <p style={styles.noMessages}>
                Aucun message pour le moment
              </p>
            ) : (
              <div style={styles.conversationList}>
                {conversations.map(conv => (
                  <div 
                    key={conv.id} 
                    style={styles.conversationItem}
                    onClick={() => setSelectedChat(conv)}
                  >
                    <img 
                      src={conv.other_user?.avatar_url || '/default-avatar.png'} 
                      style={styles.conversationAvatar}
                      alt={conv.other_user?.username}
                    />
                    <div style={styles.conversationInfo}>
                      <strong style={styles.conversationName}>
                        {conv.other_user?.username}
                      </strong>
                      <p style={styles.conversationPreview}>
                        {conv.last_message?.content?.slice(0, 30)}...
                      </p>
                    </div>
                    <span style={styles.conversationTime}>
                      {new Date(conv.updated_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Zone de chat */}
          <div style={styles.chatArea}>
            {selectedChat ? (
              <>
                <div style={styles.chatHeader}>
                  <img 
                    src={selectedChat.other_user?.avatar_url || '/default-avatar.png'} 
                    style={styles.chatAvatar}
                    alt={selectedChat.other_user?.username}
                  />
                  <div style={styles.chatHeaderInfo}>
                    <strong>{selectedChat.other_user?.username}</strong>
                    <span style={styles.chatStatus}>En ligne</span>
                  </div>
                </div>
                
                <div style={styles.chatMessages}>
                  <p style={styles.noMessagesText}>
                    Les messages apparaîtront ici...
                  </p>
                </div>
                
                <div style={styles.chatInputContainer}>
                  <input
                    type="text"
                    placeholder="Tapez votre message..."
                    style={styles.chatInput}
                  />
                  <button style={styles.sendButton}>
                    Envoyer
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.noChatSelected}>
                <div style={styles.noChatIcon}>💬</div>
                <h3>Selectionnez une conversation</h3>
                <p>Choisissez un contact pour commencer à discuter</p>
              </div>
            )}
          </div>
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
  messagesContainer: {
    display: 'flex',
    height: 'calc(100vh - 120px)',
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sidebar: {
    width: '300px',
    borderRight: '1px solid #eee',
    padding: '20px',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  noMessages: {
    textAlign: 'center',
    color: '#666',
    marginTop: '50px',
  },
  conversationList: {
    overflowY: 'auto',
    height: 'calc(100% - 40px)',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '5px',
  },
  conversationAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: '14px',
  },
  conversationPreview: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px',
  },
  conversationTime: {
    fontSize: '11px',
    color: '#999',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    padding: '20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
  },
  chatAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  chatHeaderInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  chatStatus: {
    fontSize: '12px',
    color: '#4CAF50',
  },
  chatMessages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  noMessagesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: '50px',
  },
  chatInputContainer: {
    display: 'flex',
    padding: '20px',
    borderTop: '1px solid #eee',
  },
  chatInput: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    marginRight: '10px',
  },
  sendButton: {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  noChatSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#666',
  },
  noChatIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
};
