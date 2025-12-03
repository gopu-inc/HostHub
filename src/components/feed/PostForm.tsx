import React, { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Image, Video, Code, Hash, X, Smile } from 'ucide-react'
import { useMutation, useQueryClient } from 'react-query'
import { createPost } from '@/services/api/posts'
import { uploadToCloudinary } from '@/services/cloudinary'
import toast from 'react-hot-toast'
import EmojiPicker from 'emoji-picker-react'

const PostForm: React.FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hashtagInputRef = useRef<HTMLInputElement>(null)

  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
      setContent('')
      setMediaFiles([])
      setHashtags([])
      toast.success('Post publié avec succès!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la publication')
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setMediaFiles(prev => [...prev, ...files])
  }

  const handleHashtagAdd = () => {
    const input = hashtagInputRef.current
    if (input && input.value.trim()) {
      const tag = input.value.trim().toLowerCase()
      if (!hashtags.includes(tag)) {
        setHashtags(prev => [...prev, tag])
      }
      input.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Le post ne peut pas être vide')
      return
    }

    try {
      // Upload des médias vers Cloudinary
      const mediaUrls = await Promise.all(
        mediaFiles.map(file => uploadToCloudinary(file, 'posts'))
      )

      await createPostMutation.mutateAsync({
        content,
        media_urls: mediaUrls,
        hashtags,
        is_public: isPublic
      })
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag))
  }

  const onEmojiClick = (emojiObject: any) => {
    setContent(prev => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Quoi de neuf, ${user?.username} ?`}
            className="w-full h-24 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:text-white"
          />
        </div>
      </div>

      {/* Prévisualisation des médias */}
      {mediaFiles.length > 0 && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              #{tag}
              <button
                onClick={() => removeHashtag(tag)}
                className="ml-2 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Options */}
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title="Ajouter une image"
          >
            <Image className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title="Ajouter une vidéo"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title="Ajouter du code"
          >
            <Code className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Ajouter un emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 z-10">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <input
              ref={hashtagInputRef}
              type="text"
              placeholder="hashtag"
              className="px-2 py-1 w-24 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleHashtagAdd())}
            />
            <button
              type="button"
              onClick={handleHashtagAdd}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Ajouter
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Public</span>
          </label>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createPostMutation.isLoading || (!content.trim() && mediaFiles.length === 0)}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {createPostMutation.isLoading ? 'Publication...' : 'Publier'}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default PostForm
