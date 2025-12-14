'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../../../components/Navbar'
import PaymentButtons from '../../../components/PaymentButtons'
import { getToken, getUser } from '../../../lib/auth-client'

interface Event {
  id: number
  title: string
  description: string
  location: string
  event_date: string
  image: string | null
  category: string | null
  organizer: {
    id: number
    email: string
  }
  tickets: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
}

const categoryNames: { [key: string]: { name: string; icon: string; color: string } } = {
  concert: { name: 'Concert', icon: '🎶', color: 'bg-purple-100 text-purple-700' },
  culture: { name: 'Culture', icon: '🎭', color: 'bg-blue-100 text-blue-700' },
  conference: { name: 'Conférence', icon: '🎤', color: 'bg-green-100 text-green-700' },
  sport: { name: 'Sport', icon: '⚽', color: 'bg-orange-100 text-orange-700' },
  formation: { name: 'Formation', icon: '🎓', color: 'bg-indigo-100 text-indigo-700' },
  festival: { name: 'Festival', icon: '🎉', color: 'bg-pink-100 text-pink-700' },
  autre: { name: 'Autre', icon: '🎪', color: 'bg-gray-100 text-gray-700' },
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [availableTickets, setAvailableTickets] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    setUser(getUser())
    fetchEvent()
  }, [])

  useEffect(() => {
    if (event) {
      fetch(`/api/events/${params.id}/view`, { method: 'POST' }).catch(() => {})
    }
  }, [event])

  useEffect(() => {
    if (event && event.tickets.length > 0) {
      fetchAvailableTickets()
    }
  }, [event])

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}`)
      const data = await res.json()
      setEvent(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableTickets = async () => {
    if (!event) return
    try {
      const res = await fetch(`/api/events/${params.id}/bookings`)
      const availability = await res.json()

      const available: { [key: number]: number } = {}
      availability.forEach((item: any) => {
        available[item.ticket_id] = item.available
      })
      setAvailableTickets(available)
    } catch (error) {
      const available: { [key: number]: number } = {}
      event.tickets.forEach((ticket) => {
        available[ticket.id] = ticket.quantity || 0
      })
      setAvailableTickets(available)
    }
  }

  const handlePaymentSuccess = async (method: 'airtel' | 'moov') => {
    // Après le paiement réussi, créer la réservation
    await createBooking(method)
  }

  const handlePaymentError = (error: string) => {
    setMessage({ type: 'error', text: `Erreur de paiement: ${error}` })
    setBookingLoading(false)
  }

  const createBooking = async (paymentMethod?: string) => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/events/${params.id}`))
      return
    }

    if (!selectedTicket) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un billet' })
      return
    }

    setBookingLoading(true)
    setMessage(null)

    try {
      const token = getToken()
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_id: selectedTicket,
          quantity,
          payment_method: paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la réservation' })
        setBookingLoading(false)
        setShowPayment(false)
        return
      }

      setMessage({ type: 'success', text: 'Réservation effectuée avec succès!' })
      setSelectedTicket(null)
      setQuantity(1)
      setShowPayment(false)
      fetchEvent()
      fetchAvailableTickets()
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la réservation' })
    } finally {
      setBookingLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/events/${params.id}`))
      return
    }

    if (!selectedTicket) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un billet' })
      return
    }

    const selectedTicketData = event?.tickets.find(t => t.id === selectedTicket)
    const totalAmount = selectedTicketData ? selectedTicketData.price * quantity : 0

    // Si l'événement est gratuit, créer directement la réservation
    if (totalAmount === 0) {
      await createBooking()
      return
    }

    // Sinon, afficher les options de paiement
    setShowPayment(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </>
    )
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Événement non trouvé</p>
            <Link
              href="/events"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Retour aux événements
            </Link>
          </div>
        </div>
      </>
    )
  }

  const selectedTicketData = event.tickets.find(t => t.id === selectedTicket)
  const maxQuantity = selectedTicketData && selectedTicket
    ? (availableTickets[selectedTicket] || selectedTicketData.quantity || 0)
    : 1
  const totalAmount = selectedTicketData ? selectedTicketData.price * quantity : 0

  const category = categoryNames[event.category || 'autre']

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link></li>
              <li>/</li>
              <li><Link href="/events" className="hover:text-blue-600 transition-colors">Événements</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{event.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image principale */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {event.image ? (
                  <div className="relative h-64 sm:h-80 lg:h-96 w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="h-64 sm:h-80 lg:h-96 w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-8xl">{category.icon}</span>
                  </div>
                )}
              </div>

              {/* Informations */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${category.color}`}>
                    {category.icon} {category.name}
                  </span>
                  {event.tickets.length > 0 && event.tickets.some(t => t.price === 0) && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      Gratuit disponible
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">{event.title}</h1>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl">📅</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Date et heure</p>
                      <p className="text-gray-600">{formatDate(event.event_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Lieu</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Organisateur</p>
                      <p className="text-gray-600">{event.organizer.email}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne réservation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Réserver votre place</h2>
                
                {event.tickets.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Aucun billet disponible</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {event.tickets.map((ticket) => {
                        const available = availableTickets[ticket.id] ?? ticket.quantity ?? 0
                        const isSelected = selectedTicket === ticket.id
                        return (
                          <button
                            key={ticket.id}
                            onClick={() => available > 0 && setSelectedTicket(ticket.id)}
                            disabled={available === 0}
                            className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                : available > 0
                                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                : 'border-gray-200 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1 text-gray-900">{ticket.name}</h3>
                                <p className={`text-sm ${available > 0 ? 'text-gray-600' : 'text-red-600'}`}>
                                  {available > 0 ? (
                                    <span>{available} place{available > 1 ? 's' : ''} disponible{available > 1 ? 's' : ''}</span>
                                  ) : (
                                    <span>Complet</span>
                                  )}
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                {ticket.price === 0 ? (
                                  <p className="text-xl font-bold text-green-600">Gratuit</p>
                                ) : (
                                  <p className="text-xl font-bold text-blue-600">
                                    {ticket.price.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {selectedTicket && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <label className="font-semibold text-gray-900">Quantité:</label>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              disabled={quantity <= 1}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={maxQuantity}
                              value={quantity}
                              onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center font-semibold"
                            />
                            <button
                              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                              disabled={quantity >= maxQuantity}
                              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {selectedTicketData && (
                          <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {selectedTicketData.name} × {quantity}
                              </span>
                              <span className="font-semibold text-gray-900">
                                {selectedTicketData.price === 0
                                  ? 'Gratuit'
                                  : `${(selectedTicketData.price * quantity).toLocaleString('fr-FR')} FCFA`}
                              </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                              <span className="text-gray-900">Total</span>
                              <span className="text-blue-600">
                                {totalAmount === 0
                                  ? 'Gratuit'
                                  : `${totalAmount.toLocaleString('fr-FR')} FCFA`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {message && (
                      <div
                        className={`mb-4 p-4 rounded-xl ${
                          message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    {!showPayment ? (
                      <button
                        onClick={handleBooking}
                        disabled={bookingLoading || !selectedTicket || maxQuantity === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        {bookingLoading
                          ? 'Traitement...'
                          : !user
                          ? 'Se connecter pour réserver'
                          : !selectedTicket
                          ? 'Sélectionner un billet'
                          : totalAmount === 0
                          ? 'Réserver gratuitement'
                          : 'Procéder au paiement'}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Montant à payer</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {totalAmount.toLocaleString('fr-FR')} FCFA
                            </span>
                          </div>
                        </div>
                        
                        <PaymentButtons
                          amount={totalAmount}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                          disabled={bookingLoading}
                        />
                        
                        <button
                          onClick={() => setShowPayment(false)}
                          className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
