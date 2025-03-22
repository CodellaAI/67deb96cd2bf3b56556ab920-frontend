
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import ClipCard from '@/components/ClipCard'
import { Loader } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import toast from 'react-hot-toast'

export default function Home() {
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchClips = async (pageNum = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clips?page=${pageNum}&limit=10`)
      
      if (pageNum === 1) {
        setClips(response.data.clips)
      } else {
        setClips(prev => [...prev, ...response.data.clips])
      }
      
      setHasMore(response.data.hasMore)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching clips:', error)
      toast.error('Failed to load clips')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClips()
  }, [])

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= 
      document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage(prev => prev + 1)
      fetchClips(page + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Discover Trending Clips</h1>
      
      {clips.length === 0 && !loading ? (
        <EmptyState 
          title="No clips yet!"
          description="Be the first to share an amazing clip from YouTube."
          actionLabel="Upload a Clip"
          actionHref="/upload"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map(clip => (
            <ClipCard key={clip._id} clip={clip} />
          ))}
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Loader className="h-6 w-6 animate-spin text-primary-500" />
            <span>Loading clips...</span>
          </div>
        </div>
      )}
      
      {!hasMore && clips.length > 0 && (
        <p className="text-center text-gray-500 mt-8">You've seen all clips!</p>
      )}
    </div>
  )
}
