
import { useState } from 'react'
import { ThumbsUp, Flag } from 'lucide-react'
import Avatar from './Avatar'
import toast from 'react-hot-toast'

export default function Comment({ comment }) {
  const [liked, setLiked] = useState(comment.isLiked || false)
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0)
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSecs < 60) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }
  
  const handleLike = () => {
    // This would normally call the API
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    toast.success(liked ? 'Like removed' : 'Comment liked!')
  }
  
  return (
    <div className="flex space-x-3">
      <Avatar
        src={comment.user?.avatar}
        alt={comment.user?.username}
        className="h-10 w-10 rounded-full flex-shrink-0"
      />
      
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-medium mr-2">{comment.user?.username}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        
        <p className="text-gray-800 dark:text-gray-200 mb-2 whitespace-pre-line">
          {comment.content}
        </p>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <button 
            className={`flex items-center mr-4 ${liked ? 'text-primary-500' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{likesCount > 0 ? likesCount : ''}</span>
          </button>
          
          <button 
            className="flex items-center text-gray-500 hover:text-red-500"
            onClick={() => toast.error('Report functionality coming soon')}
          >
            <Flag className="h-4 w-4" />
            <span className="sr-only">Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}
