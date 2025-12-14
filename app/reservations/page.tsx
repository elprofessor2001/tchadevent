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

export default function ReservationsPage() {
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

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes réservations</h1>
            <p className="text-gray-600">Consultez toutes vos réservations</p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🎫</div>
              <p className="text-gray-600 text-lg mb-6">Vous n'avez aucune réservation</p>
              <Link
                href="/events"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Découvrir les événements
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingBookings.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">À venir</h2>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500"
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          {booking.ticket.event.image && (
                            <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={booking.ticket.event.image}
                                alt={booking.ticket.event.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                              {booking.ticket.event.title}
                            </h3>
                            <div className="space-y-2 text-sm sm:text-base text-gray-600 mb-4">
                              <p className="flex items-center gap-2">
                                <span className="text-xl">📅</span>
                                {formatDate(booking.ticket.event.event_date)}
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-xl">📍</span>
                                {booking.ticket.event.location}
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-xl">🎫</span>
                                {booking.ticket.name} - {booking.quantity} place{booking.quantity > 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                Confirmé
                              </span>
                              <span className="text-gray-500 text-sm">
                                Réservé le {formatDate(booking.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-3xl font-bold text-blue-600 mb-4">
                              {(booking.ticket.price * booking.quantity).toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
                            </p>
                            <Link
                              href={`/events/${booking.ticket.event.id}`}
                              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
                            >
                              Voir l'événement
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pastBookings.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Historique</h2>
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl shadow-lg p-6 opacity-75 border-l-4 border-gray-400"
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          {booking.ticket.event.image && (
                            <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={booking.ticket.event.image}
                                alt={booking.ticket.event.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-3 text-gray-900">
                              {booking.ticket.event.title}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                              <p className="flex items-center gap-2">📅 {formatDate(booking.ticket.event.event_date)}</p>
                              <p className="flex items-center gap-2">📍 {booking.ticket.event.location}</p>
                              <p className="flex items-center gap-2">🎫 {booking.ticket.name} - {booking.quantity} place{booking.quantity > 1 ? 's' : ''}</p>
                            </div>
                            <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                              Terminé
                            </span>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-2xl font-bold text-gray-600">
                              {(booking.ticket.price * booking.quantity).toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
