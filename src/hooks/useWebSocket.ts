import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import WebSocketService from '@/services/websocket/websocket'

export const useWebSocket = () => {
  const { user, token } = useAuth()
  const wsServiceRef = useRef<WebSocketService | null>(null)

  useEffect(() => {
    if (user && token) {
      wsServiceRef.current = WebSocketService.getInstance()
      wsServiceRef.current.connect(user.id)
      
      return () => {
        wsServiceRef.current?.disconnect()
      }
    }
  }, [user, token])

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.emit('message', {
        type: 'message',
        receiver_id: receiverId,
        content
      })
    }
  }, [])

  const sendTypingIndicator = useCallback((receiverId: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.emit('typing', {
        type: 'typing',
        receiver_id: receiverId
      })
    }
  }, [])

  const markAsRead = useCallback((senderId: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.emit('read', {
        type: 'read',
        sender_id: senderId
      })
    }
  }, [])

  const onMessage = useCallback((callback: (data: any) => void) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.on('new_message', callback)
    }
    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.off('new_message', callback)
      }
    }
  }, [])

  const onTyping = useCallback((callback: (data: any) => void) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.on('user_typing', callback)
    }
    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.off('user_typing', callback)
      }
    }
  }, [])

  const onServerMessage = useCallback((callback: (data: any) => void) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.on('server_message', callback)
    }
    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.off('server_message', callback)
      }
    }
  }, [])

  return {
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    onMessage,
    onTyping,
    onServerMessage
  }
}
