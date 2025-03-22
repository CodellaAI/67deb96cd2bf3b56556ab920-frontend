
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader, Send, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Comment from './Comment'
import { useRouter } from 'next/navigation'

export default function CommentSection({ clipId }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clips/${clipId}/comments`)
        setComments(response.data.comments)
      } catch (error) {
        console.error('Error fetching comments:', error)
        toast.error('Failed to load comments')
      } finally {
        setLoading(false)
      }
    }

    if (clipId) {
      fetchComments()
    }
  }, [clipId])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to comment')
      router.push('/auth/login')
      return
    }
    
    if (!newComment.trim()) return
    
    setSubmitting(true)
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clips/${clipId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      setComments([response.data.comment, ...comments])
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder={isAuthenticated ? "Add a comment..." : "Login to comment"}
            className="input-field flex-grow"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated || submitting}
          />
          <button
            type="submit"
            className="ml-2 btn-primary"
            disabled={!isAuthenticated || !newComment.trim() || submitting}
          >
            {submitting ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Post comment</span>
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="h-6 w-6 animate-spin text-primary-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}
