
import Image from 'next/image'
import { User } from 'lucide-react'

export default function Avatar({ src, alt, className = 'h-10 w-10' }) {
  if (!src) {
    return (
      <div className={`bg-gray-200 dark:bg-dark-300 flex items-center justify-center rounded-full ${className}`}>
        <User className="h-1/2 w-1/2 text-gray-500 dark:text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Image 
        src={src} 
        alt={alt || 'User avatar'} 
        fill
        className="object-cover rounded-full"
      />
    </div>
  )
}
