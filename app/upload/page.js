
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, X, Loader } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function UploadPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateYoutubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
    return regex.test(url)
  }

  const validateTimestamp = (time) => {
    // Accept formats like 1:30, 01:30, 1:30:45
    const regex = /^(\d+:)?([0-5]?\d):([0-5]\d)$/
    return regex.test(time)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to upload clips')
      router.push('/auth/login')
      return
    }

    // Validate inputs
    if (!validateYoutubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL')
      return
    }

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (startTime && !validateTimestamp(startTime)) {
      setError('Start time should be in format MM:SS or HH:MM:SS')
      return
    }

    if (endTime && !validateTimestamp(endTime)) {
      setError('End time should be in format MM:SS or HH:MM:SS')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clips`, {
        youtubeUrl,
        title,
        description,
        startTime: startTime || '0:00',
        endTime: endTime || '',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      toast.success('Clip uploaded successfully!')
      router.push(`/clip/${response.data.clip._id}`)
    } catch (error) {
      console.error('Error uploading clip:', error)
      setError(error.response?.data?.message || 'Failed to upload clip. Please try again.')
      toast.error('Failed to upload clip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6">Upload a New Clip</h1>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start">
            <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="youtubeUrl" className="block mb-2 font-medium">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <input
              id="youtubeUrl"
              type="text"
              className="input-field"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="input-field"
              placeholder="Give your clip a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="input-field min-h-[100px]"
              placeholder="Add a description for your clip"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="startTime" className="block mb-2 font-medium">
                Start Time
              </label>
              <input
                id="startTime"
                type="text"
                className="input-field"
                placeholder="1:30"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Format: MM:SS or HH:MM:SS</p>
            </div>
            <div>
              <label htmlFor="endTime" className="block mb-2 font-medium">
                End Time
              </label>
              <input
                id="endTime"
                type="text"
                className="input-field"
                placeholder="2:45"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for end of video</p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload Clip
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
