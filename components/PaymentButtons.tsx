'use client'

import { useState } from 'react'

interface PaymentButtonsProps {
  amount: number
  onPaymentSuccess?: (method: 'airtel' | 'moov') => void
  onPaymentError?: (error: string) => void
  disabled?: boolean
}

export default function PaymentButtons({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  disabled = false 
}: PaymentButtonsProps) {
  const [loading, setLoading] = useState<'airtel' | 'moov' | null>(null)

  const handlePayment = async (method: 'airtel' | 'moov') => {
    if (disabled || loading) return

    setLoading(method)

    try {
      // Vérifier si les API de paiement sont configurées
      const response = await fetch('/api/payments/check', {
        method: 'GET',
      })

      const data = await response.json()

      if (!data.enabled) {
        // Les API ne sont pas configurées, refuser le paiement
        if (onPaymentError) {
          onPaymentError('Les paiements ne sont pas encore activés. Veuillez contacter l\'administrateur.')
        }
        setLoading(null)
        return
      }

      // Si les API sont configurées, procéder au paiement
      const paymentResponse = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          amount,
        }),
      })

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Erreur lors du traitement du paiement')
      }

      if (onPaymentSuccess) {
        onPaymentSuccess(method)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de paiement'
      if (onPaymentError) {
        onPaymentError(errorMessage)
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 mb-3 text-center">
        Choisissez votre méthode de paiement
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Airtel Money */}
        <button
          onClick={() => handlePayment('airtel')}
          disabled={disabled || loading !== null}
          className={`
            relative flex items-center justify-center gap-3 p-4 rounded-xl font-semibold
            transition-all duration-300 transform
            ${disabled || loading !== null
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {loading === 'airtel' ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Traitement...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="text-lg">Airtel Money</span>
            </>
          )}
        </button>

        {/* Moov Money */}
        <button
          onClick={() => handlePayment('moov')}
          disabled={disabled || loading !== null}
          className={`
            relative flex items-center justify-center gap-3 p-4 rounded-xl font-semibold
            transition-all duration-300 transform
            ${disabled || loading !== null
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {loading === 'moov' ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Traitement...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="text-lg">Moov Money</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-xs text-gray-500 text-center">
          Paiement sécurisé et crypté
        </p>
      </div>
    </div>
  )
}

