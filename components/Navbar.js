
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Upload, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Avatar from './Avatar'

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload, authRequired: true },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled 
          ? 'bg-white/80 dark:bg-dark-100/80 backdrop-blur-md shadow-sm' 
          : 'bg-white dark:bg-dark-100'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ClipStream
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null

              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg flex items-center transition-colors ${
                    pathname === link.href
                      ? 'bg-gray-100 dark:bg-dark-200 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200'
                  }`}
                >
                  <link.icon className="h-5 w-5 mr-1" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
            
            {isAuthenticated ? (
              <div className="relative ml-2 group">
                <button className="flex items-center">
                  <Avatar
                    src={user?.avatar}
                    alt={user?.username}
                    className="h-8 w-8 rounded-full"
                  />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-200 rounded-lg shadow-lg py-2 hidden group-hover:block border border-gray-200 dark:border-dark-300">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-300">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  
                  <Link 
                    href={`/profile/${user?._id}`}
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  
                  <button 
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="ml-2 btn-primary"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-100 shadow-lg">
          <nav className="container mx-auto px-4 py-3 flex flex-col">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null

              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg flex items-center ${
                    pathname === link.href
                      ? 'bg-gray-100 dark:bg-dark-200 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
            
            {isAuthenticated ? (
              <>
                <Link 
                  href={`/profile/${user?._id}`}
                  className="px-4 py-3 rounded-lg flex items-center text-gray-700 dark:text-gray-300"
                  onClick={closeMobileMenu}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Link>
                
                <button 
                  onClick={() => {
                    logout()
                    closeMobileMenu()
                  }}
                  className="px-4 py-3 rounded-lg flex items-center text-gray-700 dark:text-gray-300 w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login"
                className="px-4 py-3 rounded-lg flex items-center text-primary-600 dark:text-primary-400 font-medium"
                onClick={closeMobileMenu}
              >
                Login or Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
