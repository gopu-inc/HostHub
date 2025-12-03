import api from './config'
import { Server, ServerChannel, ServerMessage } from '@/types/server'

export const getServers = async (params?: {
  is_public?: boolean
  search?: string
  limit?: number
  offset?: number
}): Promise<Server[]> => {
  const response = await api.get('/api/servers', { params })
  return response.data
}

export const getServer = async (serverId: string): Promise<Server> => {
  const response = await api.get(`/api/servers/${serverId}`)
  return response.data
}

export const createServer = async (serverData: {
  name: string
  description?: string
  is_public: boolean
  icon?: File
  banner?: File
}): Promise<Server> => {
  const formData = new FormData()
  
  formData.append('name', serverData.name)
  formData.append('is_public', serverData.is_public.toString())
  
  if (serverData.description) {
    formData.append('description', serverData.description)
  }
  
  if (serverData.icon) {
    formData.append('icon', serverData.icon)
  }
  
  if (serverData.banner) {
    formData.append('banner', serverData.banner)
  }
  
  const response = await api.post('/api/servers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const createServerChannel = async (
  serverId: string,
  channelData: {
    name: string
    channel_type: string
    topic?: string
  }
): Promise<ServerChannel> => {
  const formData = new FormData()
  
  Object.entries(channelData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString())
    }
  })
  
  const response = await api.post(`/api/servers/${serverId}/channels`, formData)
  return response.data
}

export const getServerMessages = async (
  serverId: string,
  channelId: string,
  params?: {
    before?: string
    limit?: number
  }
): Promise<ServerMessage[]> => {
  const response = await api.get(`/api/servers/${serverId}/channels/${channelId}/messages`, { params })
  return response.data
}

export const sendServerMessage = async (
  serverId: string,
  channelId: string,
  messageData: {
    content: string
    files?: File[]
    code_language?: string
    reply_to?: string
  }
): Promise<ServerMessage> => {
  const formData = new FormData()
  
  formData.append('content', messageData.content)
  
  if (messageData.code_language) {
    formData.append('code_language', messageData.code_language)
  }
  
  if (messageData.reply_to) {
    formData.append('reply_to', messageData.reply_to)
  }
  
  if (messageData.files) {
    messageData.files.forEach((file, index) => {
      formData.append(`files`, file)
    })
  }
  
  const response = await api.post(
    `/api/servers/${serverId}/channels/${channelId}/messages`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data
}
