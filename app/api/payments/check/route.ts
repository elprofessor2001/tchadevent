import { NextResponse } from 'next/server'
import { paymentConfig } from '../../../../lib/payment-config'

export const runtime = 'nodejs'

export async function GET() {
  try {
    // Vérifier si au moins une méthode de paiement est configurée
    const airtelEnabled = paymentConfig.airtel.enabled && 
                         paymentConfig.airtel.apiKey && 
                         paymentConfig.airtel.apiSecret
    
    const moovEnabled = paymentConfig.moov.enabled && 
                       paymentConfig.moov.apiKey && 
                       paymentConfig.moov.apiSecret

    const enabled = airtelEnabled || moovEnabled

    return NextResponse.json({
      enabled,
      airtel: {
        enabled: !!airtelEnabled,
      },
      moov: {
        enabled: !!moovEnabled,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la vérification des paiements:', error)
    return NextResponse.json({ enabled: false }, { status: 500 })
  }
}

