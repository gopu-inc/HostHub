import { v4 as uuidv4 } from 'uuid'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'hosthub'
): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'hosthub_upload')
  formData.append('folder', folder)
  formData.append('public_id', `${folder}/${uuidv4()}`)
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export const uploadMultipleToCloudinary = async (
  files: File[],
  folder: string = 'hosthub'
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder))
  return Promise.all(uploadPromises)
}
