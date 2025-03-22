
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClipStream - Share and Discover Video Clips',
  description: 'A platform to share and discover the best video clips from YouTube',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-dark-100 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16 pb-20">
            {children}
          </main>
          <Toaster position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
