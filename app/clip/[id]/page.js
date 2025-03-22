
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader, ThumbsUp, MessageSquare, Share2, Flag, User, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'
import Avatar from '@/components/Avatar'
import Link from 'next/link'

export default function ClipDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [clip, setClip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchClip = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clips/${id}`)
        setClip(response.data.clip)
      } catch (error) {
        console.error('Error fetching clip:', error)
        setError('Failed to load clip. It may have been removed or doesn\'t exist.')
        toast.error('Failed to load clip')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchClip()
    }
  }, [id])

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to like clips')
      router.push('/auth/login')
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clips/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      // Update clip with new like count and liked status
      setClip(prev => ({
        ...prev,
        likesCount: response.data.likesCount,
        isLiked: response.data.isLiked
      }))
      
      toast.success(response.data.isLiked ? 'Clip liked!' : 'Like removed')
    } catch (error) {
      console.error('Error liking clip:', error)
      toast.error('Failed to like clip')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: clip.title,
        text: `Check out this clip: ${clip.title}`,
        url: window.location.href,
      })
      .catch(error => console.error('Error sharing:', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !clip) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Clip Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'This clip may have been removed or doesn\'t exist.'}</p>
        <Link href="/" className="btn-primary inline-flex items-center">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to clips
        </Link>
      </div>
      
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm overflow-hidden mb-8">
        {/* Video embed */}
        <div className="aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${clip.youtubeVideoId}?start=${clip.startTimeSeconds}&end=${clip.endTimeSeconds || ''}&autoplay=1`}
            title={clip.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Clip info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{clip.title}</h1>
          
          <div className="flex items-center mb-4">
            <Link href={`/profile/${clip.user._id}`} className="flex items-center">
              <Avatar
                src={clip.user.avatar}
                alt={clip.user.username}
                className="h-10 w-10 rounded-full mr-3"
              />
              <span className="font-medium">{clip.user.username}</span>
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-auto">
              {new Date(clip.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {clip.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
              {clip.description}
            </p>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-100 dark:border-dark-300">
            <LikeButton
              isLiked={clip.isLiked}
              likesCount={clip.likesCount}
              onClick={handleLike}
            />
            
            <button 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => document.getElementById('comments').scrollIntoView({ behavior: 'smooth' })}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>{clip.commentsCount} Comments</span>
            </button>
            
            <button 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 ml-auto"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5 mr-2" />
              <span>Share</span>
            </button>
            
            <button 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600"
              onClick={() => toast.error('Report functionality coming soon')}
            >
              <Flag className="h-5 w-5" />
              <span className="sr-only">Report</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      <div id="comments" className="scroll-mt-20">
        <CommentSection clipId={id} />
      </div>
    </div>
  )
}
