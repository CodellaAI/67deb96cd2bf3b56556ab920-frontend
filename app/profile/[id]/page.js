
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader, Film, Calendar, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ClipCard from '@/components/ClipCard'
import Avatar from '@/components/Avatar'
import EmptyState from '@/components/EmptyState'

export default function ProfilePage() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [clips, setClips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const isOwnProfile = currentUser && currentUser._id === id

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const [userResponse, clipsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clips/user/${id}`)
        ])
        
        setUser(userResponse.data.user)
        setClips(clipsResponse.data.clips)
      } catch (error) {
        console.error('Error fetching profile data:', error)
        setError('Failed to load profile. User may not exist.')
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProfileData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'This user doesn\'t exist or has been removed.'}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white dark:bg-dark-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar
            src={user.avatar}
            alt={user.username}
            className="h-24 w-24 rounded-full"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Film className="h-4 w-4 mr-2" />
                <span>{user.clipsCount} clips</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
                {user.bio}
              </p>
            )}
          </div>
          
          {isOwnProfile && (
            <button className="btn-secondary">
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      {/* User's clips */}
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Film className="mr-2 h-5 w-5" />
        {isOwnProfile ? 'Your Clips' : `${user.username}'s Clips`}
      </h2>
      
      {clips.length === 0 ? (
        <EmptyState 
          title={isOwnProfile ? "You haven't uploaded any clips yet" : `${user.username} hasn't uploaded any clips yet`}
          description={isOwnProfile ? "Share your first clip with the community!" : "Check back later for content from this user."}
          actionLabel={isOwnProfile ? "Upload a Clip" : null}
          actionHref={isOwnProfile ? "/upload" : null}
          icon={<Film className="h-12 w-12 mb-2" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map(clip => (
            <ClipCard key={clip._id} clip={clip} />
          ))}
        </div>
      )}
    </div>
  )
}
