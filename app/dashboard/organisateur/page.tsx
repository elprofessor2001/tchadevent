'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../../../components/Navbar'
import { getToken, getUser } from '../../../lib/auth-client'

interface Event {
  id: number
  title: string
  description: string
  location: string
  event_date: string
  image: string | null
  category: string | null
  tickets: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
}

interface Booking {
  id: number
  quantity: number
  ticket: {
    id: number
    price: number
    event: {
      id: number
    }
  }
}

export default function OrganizerDashboard() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || (currentUser.role !== 'organisateur' && currentUser.role !== 'admin')) {
      router.push('/')
      return
    }
    setUser(currentUser)
  }, [])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const token = getToken()
      const [eventsRes, bookingsRes] = await Promise.all([
        fetch(`/api/events?organizer_id=${user?.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ])

      const eventsData = await eventsRes.json()
      const bookingsData = await bookingsRes.json()

      const myEventIds = eventsData.map((e: Event) => e.id)
      const myBookings = bookingsData.filter((b: Booking) =>
        myEventIds.includes(b.ticket.event.id)
      )

      setEvents(eventsData)
      setBookings(myBookings)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: number) => {
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

  const totalEvents = events.length
  const upcomingEvents = events.filter(e => new Date(e.event_date) > new Date()).length
  const pastEvents = events.filter(e => new Date(e.event_date) <= new Date()).length
  const totalParticipants = bookings.reduce((sum, b) => sum + (b.quantity || 0), 0)
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.ticket.price * (b.quantity || 0)), 0)
  
  // Statistiques détaillées par événement
  const eventsWithStats = events.map(event => {
    const eventBookings = bookings.filter(b => b.ticket.event.id === event.id)
    const participants = eventBookings.reduce((sum, b) => sum + (b.quantity || 0), 0)
    const revenue = eventBookings.reduce((sum, b) => sum + (b.ticket.price * (b.quantity || 0)), 0)
    const totalTickets = event.tickets.reduce((sum, t) => sum + (t.quantity || 0), 0)
    const fillRate = totalTickets > 0 ? Math.round((participants / totalTickets) * 100) : 0
    const bookingsCount = eventBookings.length
    
    return {
      ...event,
      participants,
      revenue,
      totalTickets,
      fillRate,
      bookingsCount,
    }
  })
  
  const totalBookings = bookings.length
  const averageFillRate = eventsWithStats.length > 0
    ? Math.round(eventsWithStats.reduce((sum, e) => sum + e.fillRate, 0) / eventsWithStats.length)
    : 0

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mes événements</h1>
              <p className="text-gray-600">Gérez vos événements et suivez vos statistiques</p>
            </div>
            <Link
              href="/organizer/events/create"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              + Nouvel événement
            </Link>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">{totalEvents}</div>
              <div className="text-blue-100">Total d'événements</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">{upcomingEvents}</div>
              <div className="text-green-100">Événements à venir</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">{totalParticipants}</div>
              <div className="text-purple-100">Total participants</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl font-bold mb-2">
                {totalRevenue.toLocaleString('fr-FR')}
              </div>
              <div className="text-orange-100">Revenus totaux (FCFA)</div>
            </div>
          </div>

          {/* Statistiques supplémentaires */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total réservations</p>
                  <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
                </div>
                <div className="bg-indigo-100 rounded-full p-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Taux de remplissage moyen</p>
                  <p className="text-3xl font-bold text-gray-900">{averageFillRate}%</p>
                </div>
                <div className="bg-pink-100 rounded-full p-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Événements passés</p>
                  <p className="text-3xl font-bold text-gray-900">{pastEvents}</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des événements */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🎪</div>
              <p className="text-gray-600 text-lg mb-6">Vous n'avez créé aucun événement</p>
              <Link
                href="/organizer/events/create"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Créer votre premier événement
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsWithStats.map((event) => {
                const isUpcoming = new Date(event.event_date) > new Date()

                return (
                  <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                    {event.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isUpcoming
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isUpcoming ? 'À venir' : 'Terminé'}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {event.participants} participant{event.participants > 1 ? 's' : ''}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <p className="flex items-center gap-2">📍 {event.location}</p>
                        <p className="flex items-center gap-2">📅 {new Date(event.event_date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      {/* Statistiques de l'événement */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Revenus:</span>
                          <span className="font-bold text-green-600">{event.revenue.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Remplissage:</span>
                          <span className="font-bold text-blue-600">{event.fillRate}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Réservations:</span>
                          <span className="font-bold text-purple-600">{event.bookingsCount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-colors"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/organizer/events/${event.id}/edit`}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 text-sm font-semibold transition-colors"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 text-sm font-semibold transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
