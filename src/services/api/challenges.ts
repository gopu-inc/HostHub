import api from './config'
import { Challenge, ChallengeCreate, ChallengeSubmission } from '@/types/challenge'

export const getChallenges = async (params?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<Challenge[]> => {
  const response = await api.get('/api/challenges', { params })
  return response.data
}

export const getChallenge = async (challengeId: string): Promise<Challenge> => {
  const response = await api.get(`/api/challenges/${challengeId}`)
  return response.data
}

export const createChallenge = async (challengeData: ChallengeCreate): Promise<Challenge> => {
  const formData = new FormData()
  
  Object.entries(challengeData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'cover_image' && value instanceof File) {
        formData.append(key, value)
      } else if (key === 'start_date' || key === 'end_date') {
        formData.append(key, new Date(value).toISOString())
      } else {
        formData.append(key, value.toString())
      }
    }
  })
  
  const response = await api.post('/api/challenges', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const participateChallenge = async (
  challengeId: string,
  submissionData: {
    submission_data: string
    submission_files?: File[]
  }
): Promise<{ submission_id: string }> => {
  const formData = new FormData()
  formData.append('submission_data', submissionData.submission_data)
  
  if (submissionData.submission_files) {
    submissionData.submission_files.forEach((file, index) => {
      formData.append(`submission_files`, file)
    })
  }
  
  const response = await api.post(`/api/challenges/${challengeId}/participate`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const getChallengeLeaderboard = async (
  challengeId: string,
  limit: number = 50
): Promise<ChallengeSubmission[]> => {
  const response = await api.get(`/api/challenges/${challengeId}/leaderboard`, {
    params: { limit }
  })
  return response.data
}
