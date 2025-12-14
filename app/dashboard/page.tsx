'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import { getToken, getUser } from '../../lib/auth-client'

interface Booking {
  id: number
  quantity: number
  created_at: string
  ticket: {
    id: number
    name: string
    price: number
    event: {
      id: number
      title: string
      event_date: string
      location: string
      image: string | null
    }
  }
}

export default function UserDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = getToken()
      const res = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        console.error('Erreur API bookings:', res.status, res.statusText)
        setBookings([])
        setLoading(false)
        return
      }

      const data = await res.json()
      
      // Vérifier que data est un tableau
      if (Array.isArray(data)) {
        setBookings(data)
      } else {
        console.error('La réponse API bookings n\'est pas un tableau:', data)
        setBookings([])
      }
    } catch (error) {
      console.error('Erreur:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.ticket.event.event_date) > new Date()
  )
  const pastBookings = bookings.filter(
    (b) => new Date(b.ticket.event.event_date) <= new Date()
  )

  const totalSpent = bookings.reduce((sum, b) => sum + (b.ticket.price * b.quantity), 0)

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section avec gradient animé */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                  Mon tableau de bord
                </h1>
                <p className="text-blue-100 text-lg sm:text-xl">
                  Bienvenue, <span className="font-semibold text-white">{user.email}</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                  <p className="text-white/90 text-sm font-medium mb-1">Statut</p>
                  <p className="text-white text-xl font-bold">Actif</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
          {/* Statistiques avec design moderne */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="group relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{bookings.length}</div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Total de réservations</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-600/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{upcomingBookings.length}</div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Événements à venir</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{pastBookings.length}</div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Événements passés</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-600/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                  {totalSpent > 0 ? `${totalSpent.toLocaleString('fr-FR')}` : '0'}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Total dépensé (FCFA)</div>
              </div>
            </div>
          </div>

          {/* Réservations à venir */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Mes réservations à venir</h2>
                <p className="text-gray-500 text-sm">Gérez vos prochains événements</p>
              </div>
              {upcomingBookings.length > 0 && (
                <span className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  {upcomingBookings.length} réservation{upcomingBookings.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Chargement de vos réservations...</p>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2H5zM5 13a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3a2 2 0 01-2-2v-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation à venir</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Explorez notre catalogue d'événements et réservez vos billets pour vivre des moments inoubliables
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Découvrir les événements
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="group relative border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 bg-white hover:border-blue-300"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {booking.ticket.event.image && (
                        <div className="relative w-full lg:w-40 h-56 lg:h-40 rounded-xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                          <Image
                            src={booking.ticket.event.image}
                            alt={booking.ticket.event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                              {booking.ticket.event.title}
                            </h3>
                            <div className="space-y-2.5 text-sm sm:text-base text-gray-600">
                              <p className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-5 h-5 text-blue-600">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </span>
                                <span className="font-medium">{formatDate(booking.ticket.event.event_date)}</span>
                              </p>
                              <p className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-5 h-5 text-blue-600">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </span>
                                <span>{booking.ticket.event.location}</span>
                              </p>
                              <p className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-5 h-5 text-blue-600">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2H5zM5 13a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3a2 2 0 01-2-2v-7z" />
                                  </svg>
                                </span>
                                <span className="font-medium">{booking.ticket.name} - {booking.quantity} place{booking.quantity > 1 ? 's' : ''}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-left lg:text-right">
                            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                              {(booking.ticket.price * booking.quantity).toLocaleString('fr-FR')}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">FCFA</p>
                            <Link
                              href={`/events/${booking.ticket.event.id}`}
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Voir l'événement
                            </Link>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                          <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Réservé
                          </span>
                          <span className="text-gray-500 text-sm">
                            Réservé le {formatDate(booking.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historique */}
          {pastBookings.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Historique</h2>
                  <p className="text-gray-500 text-sm">Vos événements passés</p>
                </div>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                  {pastBookings.length} événement{pastBookings.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all duration-300 opacity-90 hover:opacity-100"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-700">
                          {booking.ticket.event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(booking.ticket.event.event_date)}
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {booking.ticket.event.location}
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2H5zM5 13a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3a2 2 0 01-2-2v-7z" />
                            </svg>
                            {booking.ticket.name} - {booking.quantity} place{booking.quantity > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <span className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Terminé
                        </span>
                        <span className="text-gray-700 font-bold text-lg">
                          {(booking.ticket.price * booking.quantity).toLocaleString('fr-FR')} <span className="text-sm text-gray-500">FCFA</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
