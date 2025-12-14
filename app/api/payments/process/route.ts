import { NextResponse } from 'next/server'
import { paymentConfig } from '../../../../lib/payment-config'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { method, amount } = body

    if (!method || !amount) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    const config = paymentConfig[method as 'airtel' | 'moov']
    
    // Vérifier que la méthode est activée et configurée
    if (!config.enabled || !config.apiKey || !config.apiSecret) {
      return NextResponse.json(
        { error: `Le paiement via ${method === 'airtel' ? 'Airtel Money' : 'Moov Money'} n'est pas encore configuré. Veuillez contacter l'administrateur.` },
        { status: 503 }
      )
    }

    // TODO: Implémenter l'appel API réel selon la méthode choisie
    // Pour l'instant, on refuse le paiement si les API ne sont pas vraiment configurées
    
    return NextResponse.json(
      { error: 'Les API de paiement ne sont pas encore intégrées. Veuillez configurer les clés API dans .env.local' },
      { status: 503 }
    )
  } catch (error) {
    console.error('Erreur de paiement:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du paiement' },
      { status: 500 }
    )
  }
}

