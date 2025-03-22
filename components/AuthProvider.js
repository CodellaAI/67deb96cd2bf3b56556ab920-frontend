
'use client'

import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem('token')
    
    if (token) {
      fetchUserProfile(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setUser(response.data.user)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    Cookies.set('token', token, { expires: 7 })
    setUser(userData)
    
    // Set default auth header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const logout = () => {
    localStorage.removeItem('token')
    Cookies.remove('token')
    setUser(null)
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
