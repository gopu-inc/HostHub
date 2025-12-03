import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getMessages, sendMessage } from '@/services/api/messages'
import { User, Send, Paperclip, Smile, Image as ImageIcon } from 'lucide-react'
import Message from './Message'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import EmojiPicker from 'emoji-picker-react'
import toast from 'react-hot-toast'

interface ChatWindowProps {
  receiverId: string
  receiver?: {
    id: string
    username: string
    avatar_url?: string
  }
}

const ChatWindow: React.FC<ChatWindowProps> = ({ receiverId, receiver }) => {
  const { user } = useAuth()
  const { sendMessage: wsSendMessage, onMessage, onTyping } = useWebSocket()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const { data: messages, isLoading } = useQuery(
    ['messages', receiverId],
    () => getMessages(receiverId, { limit: 50 }),
    {
      enabled: !!receiverId,
      refetchOnWindowFocus: false
    }
  )

  const sendMessageMutation = useMutation(
    (content: string) => sendMessage({ receiver_id: receiverId, content }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', receiverId])
      },
      onError: (error: any) => {
        toast.error('Erreur lors de l\'envoi du message')
      }
    }
  )

  // Écouter les nouveaux messages WebSocket
  useEffect(() => {
    const unsubscribe = onMessage((data) => {
      if (data.sender_id === receiverId) {
        queryClient.invalidateQueries(['messages', receiverId])
      }
    })
    return unsubscribe
  }, [receiverId, onMessage, queryClient])

  // Écouter les indicateurs de frappe
  useEffect(() => {
    const unsubscribe = onTyping((data) => {
      if (data.user_id === receiverId) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 2000)
      }
    })
    return unsubscribe
  }, [receiverId, onTyping])

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return

    try {
      // Envoyer via WebSocket en temps réel
      wsSendMessage(receiverId, message)
      
      // Également sauvegarder via l'API
      await sendMessageMutation.mutateAsync(message)
      
      setMessage('')
      setShowEmojiPicker(false)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [message, receiverId, wsSendMessage, sendMessageMutation])

  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Émettre l'événement de frappe
    const wsService = window.wsService
    if (wsService) {
      wsService.emit('typing', {
        type: 'typing',
        receiver_id: receiverId
      })
    }

    // Réinitialiser le timeout
    typingTimeoutRef.current = setTimeout(() => {
      // L'utilisateur a arrêté de taper
    }, 1000)
  }, [receiverId])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const onEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji)
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du chat */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
            {receiver?.avatar_url ? (
              <img
                src={receiver.avatar_url}
                alt={receiver.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {receiver?.username}
            </h3>
            {isTyping && (
              <p className="text-sm text-green-600 dark:text-green-400">
                En train d'écrire...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun message. Commencez la conversation!
            </p>
          </div>
        ) : (
          messages?.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-10">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez un message..."
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:text-white"
                rows={2}
              />
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(), 'PP', { locale: fr })}
                </div>
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isLoading}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
