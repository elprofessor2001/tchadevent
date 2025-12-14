'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUser, logout } from '../lib/auth-client'

export default function Navbar() {
  const [user, setUserState] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setUserState(getUser())
  }, [])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TchadEvent
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/events" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Événements
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              À propos
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Contact
            </Link>
            
            {user ? (
              <>
                {user.role === 'organisateur' && (
                  <Link 
                    href="/dashboard/organisateur" 
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    Mes événements
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    href="/dashboard/admin" 
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    Administration
                  </Link>
                )}
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  Tableau de bord
                </Link>
                <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-3">
                  <span className="text-sm text-gray-600 hidden lg:block max-w-[150px] truncate">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/events" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Événements
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {user ? (
                <>
                  {user.role === 'organisateur' && (
                    <Link 
                      href="/dashboard/organisateur" 
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mes événements
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link 
                      href="/dashboard/admin" 
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Administration
                    </Link>
                  )}
                  <Link 
                    href="/dashboard" 
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="px-4 py-2 text-sm text-gray-600 truncate">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-center font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
