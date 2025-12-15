'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { setToken, setUser } from '../../lib/auth-client'
import Navbar from '../../components/Navbar'

declare global {
  interface Window {
    google: any
  }
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<boolean>(false)

  // Charger Google Identity Services
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          })
        }
      }
      document.body.appendChild(script)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Afficher l'erreur détaillée pour le débogage
        let errorMessage = data.error || data.details || 'Erreur de connexion'
        
        // Ajouter les détails de diagnostic si disponibles
        if (data.details && data.details !== errorMessage) {
          errorMessage += ` (${data.details})`
        }
        
        console.error('Login API Error:', { 
          status: res.status, 
          error: data,
          fullResponse: data 
        })
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      setToken(data.token)
      setUser(data.user)
      const redirect = searchParams.get('redirect')
      router.push(redirect ? decodeURIComponent(redirect) : '/')
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err?.message || 'Erreur de connexion'
      setError(`Erreur de connexion: ${errorMessage}`)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setOauthLoading(true)

    try {
      if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        setError('Google SDK non chargé ou Client ID manquant. Veuillez réessayer.')
        setOauthLoading(false)
        return
      }

      // Utiliser Google Identity Services
      window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response: any) => {
          if (response.error) {
            setError('Erreur d\'authentification Google: ' + response.error)
            setOauthLoading(false)
            return
          }

          try {
            // Récupérer les informations utilisateur avec le token
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                Authorization: `Bearer ${response.access_token}`,
              },
            })

            if (!userInfoRes.ok) {
              setError('Impossible de récupérer les informations utilisateur')
              setOauthLoading(false)
              return
            }

            const userInfo = await userInfoRes.json()

            // Envoyer au backend
            const res = await fetch('/api/auth/oauth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                provider: 'google',
                accessToken: response.access_token,
                userInfo: {
                  id: userInfo.id,
                  email: userInfo.email,
                  name: userInfo.name,
                  picture: userInfo.picture,
                },
              }),
            })

            const data = await res.json()

            if (!res.ok) {
              // Afficher l'erreur détaillée pour le débogage
              let errorMessage = data.error || data.details || 'Erreur de connexion Google'
              
              // Ajouter les détails de diagnostic si disponibles
              if (data.diagnostics) {
                const diagnostics = Object.entries(data.diagnostics)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')
                errorMessage += ` (${diagnostics})`
              }
              
              console.error('OAuth API Error:', { 
                status: res.status, 
                error: data,
                fullResponse: data 
              })
              setError(errorMessage)
              setOauthLoading(false)
              return
            }

            setToken(data.token)
            setUser(data.user)
            const redirect = searchParams.get('redirect')
            router.push(redirect ? decodeURIComponent(redirect) : '/')
          } catch (err: any) {
            console.error('OAuth error:', err)
            setError('Erreur lors de la connexion Google')
            setOauthLoading(false)
          }
        },
      }).requestAccessToken()
    } catch (err: any) {
      console.error('Google login error:', err)
      setError('Erreur de connexion Google. Veuillez vérifier votre configuration.')
      setOauthLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion
            </h2>
            <p className="text-gray-600">
              Connectez-vous à votre compte TchadEvent
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || oauthLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Ou connectez-vous avec</span>
              </div>
            </div>

            {/* Bouton Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || oauthLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {oauthLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continuer avec Google</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Créez-en un
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </>
  )
}
