'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../../../../components/Navbar'
import { getToken, getUser } from '../../../../../lib/auth-client'

const categories = [
  { id: 'concert', name: '🎶 Concert' },
  { id: 'culture', name: '🎭 Culture' },
  { id: 'conference', name: '🎤 Conférence' },
  { id: 'sport', name: '⚽ Sport' },
  { id: 'formation', name: '🎓 Formation' },
  { id: 'festival', name: '🎉 Festival' },
  { id: 'autre', name: '🎪 Autre' },
]

interface Ticket {
  id?: number
  name: string
  price: string
  quantity: string
}

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'autre',
    location: '',
    event_date: '',
    image: '',
    tickets: [] as Ticket[],
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const user = getUser()
  const token = getToken()

  useEffect(() => {
    if (!user || (user.role !== 'organisateur' && user.role !== 'admin')) {
      router.push('/')
      return
    }
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}`)
      if (!res.ok) {
        setError('Événement non trouvé')
        setLoading(false)
        return
      }
      const event = await res.json()

      // Formater la date pour l'input datetime-local
      const eventDate = event.event_date
        ? new Date(event.event_date).toISOString().slice(0, 16)
        : ''

      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'autre',
        location: event.location || '',
        event_date: eventDate,
        image: event.image || '',
        tickets: event.tickets?.map((t: any) => ({
          id: t.id,
          name: t.name || '',
          price: String(t.price || 0),
          quantity: String(t.quantity || 0),
        })) || [],
      })

      if (event.image) {
        setImagePreview(event.image)
      }
    } catch (error) {
      setError('Erreur lors du chargement de l\'événement')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('L\'image est trop grande (max 5MB)')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'upload de l\'image')
        setUploadingImage(false)
        return
      }

      setFormData({ ...formData, image: data.url })
      setImagePreview(URL.createObjectURL(file))
    } catch (error) {
      setError('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const tickets = formData.tickets
        .filter(t => t.name && t.price !== '' && t.quantity !== '')
        .map(t => ({
          id: t.id,
          name: t.name,
          price: parseInt(t.price) || 0,
          quantity: parseInt(t.quantity) || 0,
        }))

      if (tickets.length === 0) {
        setError('Veuillez ajouter au moins un billet')
        setSaving(false)
        return
      }

      const res = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          event_date: formData.event_date,
          image: formData.image,
          tickets,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la modification')
        setSaving(false)
        return
      }

      router.push('/dashboard/organisateur')
    } catch (error) {
      setError('Erreur lors de la modification de l\'événement')
      setSaving(false)
    }
  }

  const addTicket = () => {
    setFormData({
      ...formData,
      tickets: [...formData.tickets, { name: '', price: '', quantity: '' }],
    })
  }

  const removeTicket = (index: number) => {
    setFormData({
      ...formData,
      tickets: formData.tickets.filter((_, i) => i !== index),
    })
  }

  const removeImage = () => {
    setFormData({ ...formData, image: '' })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </>
    )
  }

  if (!user || (user.role !== 'organisateur' && user.role !== 'admin')) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">Modifier l'événement</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre de l'événement *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date et heure *
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lieu *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: N'Djamena, Centre culturel"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Upload d'image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image de l'événement
              </label>
              
              {imagePreview || formData.image ? (
                <div className="space-y-4">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                    <Image
                      src={imagePreview || formData.image}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer l'image
                  </button>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600 text-sm">Upload en cours...</p>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">Cliquez pour changer l'image</p>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600">Upload en cours...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-gray-700 font-medium">Cliquez pour télécharger une image</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP jusqu'à 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Billets *
                </label>
                <button
                  type="button"
                  onClick={addTicket}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un billet
                </button>
              </div>
              <div className="space-y-4">
                {formData.tickets.map((ticket, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Nom du billet
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Standard, VIP"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={ticket.name}
                          onChange={(e) => {
                            const newTickets = [...formData.tickets]
                            newTickets[index].name = e.target.value
                            setFormData({ ...formData, tickets: newTickets })
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Prix (FCFA)
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0 pour gratuit"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={ticket.price}
                          onChange={(e) => {
                            const newTickets = [...formData.tickets]
                            newTickets[index].price = e.target.value
                            setFormData({ ...formData, tickets: newTickets })
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Quantité
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={ticket.quantity}
                            onChange={(e) => {
                              const newTickets = [...formData.tickets]
                              newTickets[index].quantity = e.target.value
                              setFormData({ ...formData, tickets: newTickets })
                            }}
                          />
                          {formData.tickets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTicket(index)}
                              className="text-red-600 hover:text-red-700 px-2 flex items-center"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/organisateur')}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

