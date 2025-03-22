
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader, UserPlus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        username,
        email,
        password
      })

      login(response.data.token, response.data.user)
      toast.success('Account created successfully!')
      router.push('/')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="card p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="cooluser123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2 h-5 w-5" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
