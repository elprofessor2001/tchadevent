'use client'

import Link from 'next/link'
import Image from 'next/image'

interface EventCardProps {
  event: {
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

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Demain à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  const getMinPrice = (tickets: Array<{ price: number }>) => {
    if (tickets.length === 0) return null
    const prices = tickets.map(t => t.price || 0).filter(p => p > 0)
    return prices.length > 0 ? Math.min(...prices) : null
  }

  const category = categoryNames[event.category || 'autre']
  const minPrice = getMinPrice(event.tickets)
  const organizerName = event.organizer.name || event.organizer.email.split('@')[0]

  return (
    <Link
      href={`/events/${event.id}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Image avec overlay */}
      <div className="relative h-56 w-full overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-6xl">{category.icon}</span>
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color} backdrop-blur-sm bg-opacity-90`}>
            {category.icon} {category.name}
          </span>
          {event.verified && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white backdrop-blur-sm bg-opacity-90 flex items-center gap-1">
              ✓ Vérifié
            </span>
          )}
        </div>

        {/* Vues et likes */}
        {(event.views || event.likes) && (
          <div className="absolute top-3 right-3 flex gap-2">
            {event.views && event.views > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white backdrop-blur-sm">
                👁 {event.views}
              </span>
            )}
            {event.likes && event.likes > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 bg-opacity-90 text-white backdrop-blur-sm">
                ❤️ {event.likes}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {event.description}
        </p>

        {/* Informations */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">👤</span>
            <span className="line-clamp-1">{organizerName}</span>
          </div>
        </div>

        {/* Prix et CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {minPrice ? (
            <div>
              <p className="text-xs text-gray-500">À partir de</p>
              <p className="text-2xl font-bold text-blue-600">
                {minPrice.toLocaleString('fr-FR')} <span className="text-sm font-normal">FCFA</span>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500">Prix</p>
              <p className="text-2xl font-bold text-green-600">Gratuit</p>
            </div>
          )}
          <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm group-hover:bg-blue-700 transition-colors">
            Voir détails
          </span>
        </div>
      </div>
    </Link>
  )
}

