
export default function LikeButton({ isLiked, likesCount, onClick }) {
  return (
    <button 
      className={`flex items-center ${isLiked ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'}`}
      onClick={onClick}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill={isLiked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mr-2"
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
      <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
    </button>
  )
}
