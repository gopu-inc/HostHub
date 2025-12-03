import api from './config'
import { MarketplaceListing, MarketplacePurchase } from '@/types/marketplace'

export const getMarketplaceListings = async (params?: {
  category?: string
  tag?: string
  sort_by?: string
  min_price?: number
  max_price?: number
  limit?: number
  offset?: number
}): Promise<MarketplaceListing[]> => {
  const response = await api.get('/api/marketplace/listings', { params })
  return response.data
}

export const getListing = async (listingId: string): Promise<MarketplaceListing> => {
  const response = await api.get(`/api/marketplace/listings/${listingId}`)
  return response.data
}

export const createListing = async (listingData: {
  title: string
  description: string
  category: string
  item_type: string
  price_hcoins: number
  tags: string[]
  files?: File[]
  preview_images?: File[]
}): Promise<MarketplaceListing> => {
  const formData = new FormData()
  
  formData.append('title', listingData.title)
  formData.append('description', listingData.description)
  formData.append('category', listingData.category)
  formData.append('item_type', listingData.item_type)
  formData.append('price_hcoins', listingData.price_hcoins.toString())
  formData.append('tags', listingData.tags.join(','))
  
  if (listingData.files) {
    listingData.files.forEach((file, index) => {
      formData.append(`files`, file)
    })
  }
  
  if (listingData.preview_images) {
    listingData.preview_images.forEach((image, index) => {
      formData.append(`preview_images`, image)
    })
  }
  
  const response = await api.post('/api/marketplace/listings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const purchaseListing = async (listingId: string): Promise<MarketplacePurchase> => {
  const response = await api.post(`/api/marketplace/listings/${listingId}/purchase`)
  return response.data
}

export const getMyPurchases = async (params?: {
  limit?: number
  offset?: number
}): Promise<MarketplacePurchase[]> => {
  const response = await api.get('/api/marketplace/purchases/me', { params })
  return response.data
}

export const getMyListings = async (params?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<MarketplaceListing[]> => {
  const response = await api.get('/api/marketplace/listings/me', { params })
  return response.data
}
