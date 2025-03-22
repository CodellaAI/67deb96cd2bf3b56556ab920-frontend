
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ThumbsUp, MessageSquare, Play } from 'lucide-react'
import Avatar from './Avatar'

export default function ClipCard({ clip }) {
  const [isHovering, setIsHovering] = useState(false)
  
  return (
    <Link 
      href={`/clip/${clip._id}`}
      className="card group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
        <Image
          src={clip.thumbnailUrl || `https://img.youtube.com/vi/${clip.youtubeVideoId}/hqdefault.jpg`}
          alt={clip.title}
          className={`object-cover transition-transform duration-300 ${isHovering ? 'scale-105 opacity-80' : ''}`}
          fill
        />
        
        {/* Play button overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        
        {/* Duration badge */}
        {clip.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {clip.duration}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{clip.title}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Avatar
              src={clip.user?.avatar}
              alt={clip.user?.username}
              className="h-6 w-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {clip.user?.username}
            </span>
          </div>
          
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(clip.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-dark-300">
          <div className="flex items-center mr-4">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{clip.likesCount}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{clip.commentsCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
