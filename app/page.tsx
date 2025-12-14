'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'

interface Event {
  id: number
  title: string
  description: string
  location: string
  event_date: string
  image: string | null
  category: string | null
  verified?: boolean
  views?: number
  likes?: number
  organizer: {
    id: number
    email: string
    name?: string | null
    avatar?: string | null
  }
  tickets: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
}

const categories = [
  { id: 'concert', name: 'Concerts', icon: '🎶', color: 'from-purple-500 to-pink-500' },
  { id: 'culture', name: 'Culture', icon: '🎭', color: 'from-blue-500 to-cyan-500' },
  { id: 'conference', name: 'Conférences', icon: '🎤', color: 'from-green-500 to-emerald-500' },
  { id: 'sport', name: 'Sport', icon: '⚽', color: 'from-orange-500 to-red-500' },
  { id: 'formation', name: 'Formations', icon: '🎓', color: 'from-indigo-500 to-purple-500' },
  { id: 'festival', name: 'Festivals', icon: '🎉', color: 'from-pink-500 to-rose-500' },
]

export default function Home() {
  const [popularEvents, setPopularEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularEvents()
  }, [])

  const fetchPopularEvents = async () => {
    try {
      const res = await fetch('/api/events')
      
      if (!res.ok) {
        console.error('Erreur API:', res.status, res.statusText)
        setPopularEvents([])
        setLoading(false)
        return
      }

      const data = await res.json()
      
      // Vérifier que data est un tableau
      if (!Array.isArray(data)) {
        console.error('La réponse API n\'est pas un tableau:', data)
        setPopularEvents([])
        setLoading(false)
        return
      }

      const upcoming = data
        .filter((e: Event) => e.event_date && new Date(e.event_date) > new Date())
        .sort((a: Event, b: Event) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 6)
      setPopularEvents(upcoming)
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error)
      setPopularEvents([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in">
              Bienvenue sur <span className="text-yellow-300">TchadEvent</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto opacity-95">
              Découvrez, réservez et vivez les meilleurs événements au Tchad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
              >
                Explorer les événements
              </Link>
              <Link
                href="/register"
                className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-white/30"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>

        {/* Section Catégories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Trouvez l'événement parfait qui correspond à vos intérêts
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/events?category=${category.id}`}
                className="group bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 border border-gray-100"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl transform group-hover:rotate-12 transition-transform`}>
                  {category.icon}
                </div>
                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Événements populaires */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Événements populaires
                </h2>
                <p className="text-gray-600">
                  Les événements les plus attendus du moment
                </p>
              </div>
              <Link
                href="/events"
                className="mt-4 sm:mt-0 text-blue-600 hover:text-blue-700 font-semibold text-lg flex items-center gap-2 group"
              >
                Voir tout
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Chargement des événements...</p>
              </div>
            ) : popularEvents.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">Aucun événement disponible pour le moment</p>
                <Link
                  href="/organizer/events/create"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Créer le premier événement →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {popularEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Pourquoi TchadEvent */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir TchadEvent ?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                La plateforme de référence pour tous vos événements au Tchad
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl">
                  🇹🇩
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">100% Tchad</h3>
                <p className="text-gray-600 leading-relaxed">
                  Plateforme entièrement dédiée aux événements au Tchad, par les Tchadiens, pour les Tchadiens
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Réservation simple</h3>
                <p className="text-gray-600 leading-relaxed">
                  Réservez vos billets en quelques clics, sans complication
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-4xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Paiement sécurisé</h3>
                <p className="text-gray-600 leading-relaxed">
                  Paiements sécurisés via Airtel Money et Moov Money
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-4xl">
                  ✅
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Événements vérifiés</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tous les événements sont vérifiés pour garantir votre sécurité
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Prêt à découvrir des événements ?
            </h2>
            <p className="text-xl sm:text-2xl mb-10 opacity-95">
              Rejoignez TchadEvent dès aujourd'hui et ne manquez plus jamais un événement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
              >
                Créer un compte gratuit
              </Link>
              <Link
                href="/events"
                className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 border-2 border-white/30"
              >
                Explorer les événements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
