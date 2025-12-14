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
      const data = await res.json()
      setBookings(data)
    } catch (error) {
      console.error('Erreur:', error)
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon tableau de bord</h1>
            <p className="text-gray-600">Bienvenue, {user.email}</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">{bookings.length}</div>
              <div className="text-blue-100">Total de réservations</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">{upcomingBookings.length}</div>
              <div className="text-green-100">Événements à venir</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">{pastBookings.length}</div>
              <div className="text-purple-100">Événements passés</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">{totalSpent.toLocaleString('fr-FR')}</div>
              <div className="text-orange-100">Total dépensé (FCFA)</div>
            </div>
          </div>

          {/* Réservations à venir */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes réservations à venir</h2>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎫</div>
                <p className="text-gray-600 text-lg mb-4">Aucune réservation à venir</p>
                <Link
                  href="/events"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Découvrir les événements
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50"
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
                            Réservé
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
            )}
          </div>

          {/* Historique */}
          {pastBookings.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Historique</h2>
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-xl p-6 opacity-75 bg-gray-50"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">
                          {booking.ticket.event.title}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📅 {formatDate(booking.ticket.event.event_date)}</p>
                          <p>📍 {booking.ticket.event.location}</p>
                          <p>🎫 {booking.ticket.name} - {booking.quantity} place{booking.quantity > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Terminé
                        </span>
                        <span className="text-gray-600 font-semibold">
                          {(booking.ticket.price * booking.quantity).toLocaleString('fr-FR')} FCFA
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
