
import Link from 'next/link'
import { Film } from 'lucide-react'

export default function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  actionHref,
  icon
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-dark-300 rounded-full flex items-center justify-center mb-4 text-gray-500 dark:text-gray-400">
        {icon || <Film className="h-8 w-8" />}
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          {description}
        </p>
      )}
      
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
