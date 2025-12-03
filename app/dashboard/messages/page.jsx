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
