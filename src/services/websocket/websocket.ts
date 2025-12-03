import { io, Socket } from 'socket.io-client'

class WebSocketService {
  private socket: Socket | null = null
  private static instance: WebSocketService

  constructor() {
    const WS_URL = import.meta.env.VITE_WS_URL || 'wss://serv-ynsd.onrender.com'
    const token = localStorage.getItem('access_token')
    
    if (token) {
      this.socket = io(WS_URL, {
        auth: {
          token: token
        },
        transports: ['websocket']
      })

      this.setupEventListeners()
    }
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })
  }

  connect(userId: string) {
    if (this.socket) {
      this.socket.auth = { 
        token: localStorage.getItem('access_token'),
        userId 
      }
      this.socket.connect()
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }
}

export default WebSocketService
