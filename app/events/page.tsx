'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import EventCard from '../../components/EventCard'

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
  { id: 'autre', name: 'Autre', icon: '🎪', color: 'from-gray-500 to-gray-600' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    location: '',
    category: '',
    sort: 'date',
    verified: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const eventsPerPage = 12

  useEffect(() => {
    fetchEvents()
  }, [filters, currentPage])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.date) params.append('date', filters.date)
      if (filters.location) params.append('location', filters.location)
      if (filters.category) params.append('category', filters.category)
      if (filters.sort) params.append('sort', filters.sort)
      if (filters.verified) params.append('verified', 'true')

      const res = await fetch(`/api/events?${params.toString()}`)
      const data = await res.json()
      setEvents(data)
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error)
    } finally {
      setLoading(false)
    }
  }

  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  )
  const totalPages = Math.ceil(events.length / eventsPerPage)

  const resetFilters = () => {
    setFilters({ search: '', date: '', location: '', category: '', sort: 'date', verified: false })
    setCurrentPage(1)
  }

  const hasActiveFilters = filters.search || filters.date || filters.location || filters.category || filters.verified

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Tous les événements</h1>
            <p className="text-xl sm:text-2xl opacity-95">
              Découvrez tous les événements disponibles au Tchad
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Barre de recherche principale */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher un événement..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.search}
                    onChange={(e) => {
                      setFilters({ ...filters, search: e.target.value })
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtres
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {[filters.date, filters.location, filters.category, filters.verified].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 animate-in slide-in-from-top">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.date}
                      onChange={(e) => {
                        setFilters({ ...filters, date: e.target.value })
                        setCurrentPage(1)
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: N'Djamena"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.location}
                      onChange={(e) => {
                        setFilters({ ...filters, location: e.target.value })
                        setCurrentPage(1)
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.category}
                      onChange={(e) => {
                        setFilters({ ...filters, category: e.target.value })
                        setCurrentPage(1)
                      }}
                    >
                      <option value="">Toutes</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trier par
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filters.sort}
                      onChange={(e) => {
                        setFilters({ ...filters, sort: e.target.value })
                        setCurrentPage(1)
                      }}
                    >
                      <option value="date">Date proche</option>
                      <option value="date_desc">Date lointaine</option>
                      <option value="price_asc">Prix croissant</option>
                      <option value="price_desc">Prix décroissant</option>
                      <option value="popular">Plus aimé</option>
                      <option value="views">Plus vu</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={filters.verified}
                      onChange={(e) => {
                        setFilters({ ...filters, verified: e.target.checked })
                        setCurrentPage(1)
                      }}
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Événements vérifiés uniquement
                    </span>
                  </label>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Résultats */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-gray-600 font-medium">
              {events.length} événement{events.length > 1 ? 's' : ''} trouvé{events.length > 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Chargement des événements...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg mb-4">Aucun événement trouvé</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                  >
                    Précédent
                  </button>
                  <span className="px-6 py-2 text-gray-700 font-medium">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
