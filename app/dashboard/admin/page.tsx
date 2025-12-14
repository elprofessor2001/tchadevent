'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { getToken, getUser } from '../../../lib/auth-client'

interface User {
  id: number
  email: string
  name: string | null
  role: string
  verified: boolean | null
  created_at: string
}

interface Event {
  id: number
  title: string
  organizer_id: number
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users')

  const fetchData = async () => {
    try {
      const token = getToken()
      const [usersRes, eventsRes] = await Promise.all([
        fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/events', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ])

      // Vérifier que les réponses sont OK
      if (!usersRes.ok) {
        const errorData = await usersRes.json().catch(() => ({}))
        console.error('Erreur API users:', usersRes.status, usersRes.statusText, errorData)
        
        // Si l'utilisateur n'est pas admin, rediriger vers la page de connexion
        if (usersRes.status === 403) {
          alert('Accès refusé. Vous devez être administrateur pour accéder à cette page. Veuillez vous reconnecter.')
          router.push('/login?redirect=/dashboard/admin')
          return
        }
        
        setUsers([])
      } else {
        const usersData = await usersRes.json()
        // Vérifier que usersData est un tableau
        if (Array.isArray(usersData)) {
          setUsers(usersData)
        } else {
          console.error('La réponse API users n\'est pas un tableau:', usersData)
          setUsers([])
        }
      }

      if (!eventsRes.ok) {
        console.error('Erreur API events:', eventsRes.status, eventsRes.statusText)
        setEvents([])
      } else {
        const eventsData = await eventsRes.json()
        // Vérifier que eventsData est un tableau
        if (Array.isArray(eventsData)) {
          setEvents(eventsData)
        } else {
          console.error('La réponse API events n\'est pas un tableau:', eventsData)
          setEvents([])
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      setUsers([])
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/')
      return
    }
    setUser(currentUser)
    fetchData()
  }, [])

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return

    const token = getToken()
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleRoleChange = async (userId: number, newRole: string) => {
    const token = getToken()
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Erreur lors du changement de rôle')
        fetchData()
        return
      }

      if (userId === user?.id && newRole !== 'admin') {
        alert('Vous avez été rétrogradé. Vous allez être redirigé.')
        router.push('/')
        return
      }

      fetchData()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du changement de rôle')
      fetchData()
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

    const token = getToken()
    try {
      const res = await fetch(`/api/users/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Calculer les statistiques
  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'admin').length
  const organisateurCount = users.filter(u => u.role === 'organisateur').length
  const clientCount = users.filter(u => u.role === 'client').length
  const totalEvents = events.length

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              👨‍💼 Administration
            </h1>
            <p className="text-gray-600">Gérez les utilisateurs et les événements de la plateforme</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Total utilisateurs</p>
                  <p className="text-4xl font-bold">{totalUsers}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-1">Administrateurs</p>
                  <p className="text-4xl font-bold">{adminCount}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Organisateurs</p>
                  <p className="text-4xl font-bold">{organisateurCount}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Total événements</p>
                  <p className="text-4xl font-bold">{totalEvents}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-8 py-4 font-semibold text-sm transition-all ${
                    activeTab === 'users'
                      ? 'border-b-3 border-purple-600 text-purple-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50'
                  }`}
                >
                  👥 Utilisateurs ({users.length})
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-8 py-4 font-semibold text-sm transition-all ${
                    activeTab === 'events'
                      ? 'border-b-3 border-blue-600 text-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50'
                  }`}
                >
                  🎪 Événements ({events.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : activeTab === 'users' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u, index) => (
                        <tr 
                          key={u.id} 
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900">#{u.id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                                {u.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{u.email}</div>
                                {u.name && (
                                  <div className="text-xs text-gray-500">{u.name}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={u.id === user?.id && u.role === 'admin'}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold border-0 focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm ${
                                u.role === 'admin'
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                  : u.role === 'organisateur'
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                              }`}
                              title={
                                u.role === 'admin' 
                                  ? '👨‍💼 Administrateur : Gestion complète de la plateforme'
                                  : u.role === 'organisateur'
                                  ? '🎪 Organisateur : Créer et gérer des événements'
                                  : '👤 Participant : Consulter et réserver des billets'
                              }
                            >
                              <option value="client">👤 Participant</option>
                              <option value="organisateur">🎪 Organisateur</option>
                              <option value="admin">👨‍💼 Administrateur</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(u.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎪</div>
                      <p className="text-gray-600 text-lg">Aucun événement pour le moment</p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="flex justify-between items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50"
                      >
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500">
                            Créé le {new Date(event.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            href={`/events/${event.id}`}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Voir
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold transition-all shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
