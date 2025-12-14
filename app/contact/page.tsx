'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simuler l'envoi (à remplacer par une vraie API)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setFormData({ name: '', email: '', message: '' })
    }, 1000)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl sm:text-2xl opacity-95">
              Nous sommes là pour vous aider
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Formulaire de contact */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Envoyez-nous un message</h2>
              {submitted ? (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-bold text-lg">Message envoyé avec succès !</p>
                  </div>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    {loading ? 'Envoi...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>

            {/* Informations de contact */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Informations de contact</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Email</p>
                      <a href="mailto:contact@tchadevent.td" className="text-blue-600 hover:text-blue-700 font-medium">
                        contact@tchadevent.td
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Téléphone</p>
                      <a href="tel:+235123456789" className="text-blue-600 hover:text-blue-700 font-medium">
                        +235 12 34 56 78
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Adresse</p>
                      <p className="text-gray-700">
                        N'Djamena, Tchad
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🕒</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Heures d'ouverture</p>
                      <p className="text-gray-700">
                        Lundi - Vendredi: 9h - 18h<br />
                        Samedi: 9h - 13h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8">
                <h3 className="font-bold text-xl mb-3 text-gray-900">Besoin d'aide ?</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Notre équipe est disponible pour répondre à toutes vos questions concernant
                  l'utilisation de la plateforme, la création d'événements ou les réservations.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  En savoir plus sur TchadEvent
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
