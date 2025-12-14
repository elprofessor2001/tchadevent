'use client'

import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              À propos de TchadEvent
            </h1>
            <p className="text-xl sm:text-2xl opacity-95 max-w-3xl mx-auto">
              La plateforme de référence pour les événements au Tchad
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Mission */}
          <section className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Notre Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              TchadEvent a pour mission de faciliter l'organisation, la promotion et la réservation
              d'événements au Tchad. Nous croyons que chaque événement mérite d'être découvert et
              que chaque organisateur mérite une plateforme moderne et accessible pour partager
              ses initiatives.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Dans un contexte où la communication autour des événements repose encore beaucoup sur
              le bouche-à-oreille et les réseaux sociaux, TchadEvent propose une solution centralisée,
              moderne et accessible, adaptée aux réalités locales.
            </p>
          </section>

          {/* Vision */}
          <section className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Notre Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Devenir la référence nationale pour la gestion et la promotion des événements au Tchad.
              Nous visons à contribuer au développement du secteur culturel, événementiel et
              professionnel du pays grâce au numérique.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Notre objectif est de créer un écosystème dynamique où organisateurs et participants
              peuvent se rencontrer facilement, favorisant ainsi l'épanouissement culturel et
              économique du Tchad.
            </p>
          </section>

          {/* Objectifs */}
          <section className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nos Objectifs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Valoriser les initiatives locales</h3>
                <p className="text-gray-700">
                  Mettre en avant les événements organisés au Tchad et donner une visibilité
                  accrue aux organisateurs locaux.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Simplifier l'accès aux événements</h3>
                <p className="text-gray-700">
                  Offrir une expérience simple et intuitive pour découvrir et réserver des
                  événements, accessible sur tous les appareils.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Créer une communauté</h3>
                <p className="text-gray-700">
                  Rassembler organisateurs et participants autour d'une plateforme commune
                  qui favorise les échanges et les découvertes.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Promouvoir le numérique</h3>
                <p className="text-gray-700">
                  Contribuer à la digitalisation du secteur événementiel tchadien et
                  démontrer les avantages des solutions numériques modernes.
                </p>
              </div>
            </div>
          </section>

          {/* Public cible */}
          <section className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Notre Public</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-xl mb-3 text-blue-900 flex items-center gap-2">
                  <span className="text-2xl">👥</span> Participants
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Toute personne souhaitant découvrir et participer à des événements au Tchad :
                  concerts, conférences, festivals, formations, événements sportifs, etc.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <h3 className="font-bold text-xl mb-3 text-green-900 flex items-center gap-2">
                  <span className="text-2xl">🎪</span> Organisateurs
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Associations, entreprises, institutions et particuliers organisant des événements
                  et souhaitant les promouvoir efficacement.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoignez TchadEvent</h2>
            <p className="text-xl mb-8 opacity-95">
              Que vous soyez organisateur ou participant, TchadEvent est fait pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Créer un compte
              </Link>
              <Link
                href="/events"
                className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-white/30"
              >
                Découvrir les événements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
