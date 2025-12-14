# 💳 Guide d'intégration des paiements mobiles

## 📋 Vue d'ensemble

TchadEvent supporte les paiements via **Airtel Money** et **Moov Money**, les deux principales solutions de paiement mobile au Tchad.

## 🔧 Configuration

### 1. Variables d'environnement

Ajoutez les clés API suivantes dans votre fichier `.env.local` :

```env
# Airtel Money
AIRTEL_MONEY_API_KEY=your_airtel_api_key
AIRTEL_MONEY_API_SECRET=your_airtel_api_secret
AIRTEL_MONEY_MERCHANT_ID=your_merchant_id
AIRTEL_MONEY_API_URL=https://api.airtelmoney.com
NEXT_PUBLIC_AIRTEL_MONEY_ENABLED=true

# Moov Money
MOOV_MONEY_API_KEY=your_moov_api_key
MOOV_MONEY_API_SECRET=your_moov_api_secret
MOOV_MONEY_MERCHANT_ID=your_merchant_id
MOOV_MONEY_API_URL=https://api.moovmoney.com
NEXT_PUBLIC_MOOV_MONEY_ENABLED=true
```

### 2. Obtenir les clés API

#### Airtel Money
1. Visitez [Airtel Money Developer Portal](https://developer.airtelmoney.com)
2. Créez un compte développeur
3. Créez une application
4. Récupérez vos clés API et votre Merchant ID

#### Moov Money
1. Visitez [Moov Money Developer Portal](https://developer.moovmoney.com)
2. Créez un compte développeur
3. Créez une application
4. Récupérez vos clés API et votre Merchant ID

## 🚀 Intégration

### Étape 1 : Créer la route API de paiement

Créez le fichier `app/api/payments/process/route.ts` :

```typescript
import { NextResponse } from 'next/server'
import { paymentConfig } from '../../../../lib/payment-config'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { method, amount, ticket_id, quantity, user_id } = body

    if (!method || !amount || !ticket_id || !quantity || !user_id) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    const config = paymentConfig[method as 'airtel' | 'moov']
    
    if (!config.enabled) {
      return NextResponse.json(
        { error: `Paiement ${method} non activé` },
        { status: 400 }
      )
    }

    // TODO: Implémenter l'appel API selon la méthode choisie
    // Exemple pour Airtel Money :
    if (method === 'airtel') {
      // const response = await fetch(`${config.apiUrl}/payment`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${config.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     merchant_id: config.merchantId,
      //     amount,
      //     // autres paramètres
      //   }),
      // })
    }

    // Exemple pour Moov Money :
    if (method === 'moov') {
      // const response = await fetch(`${config.apiUrl}/payment`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${config.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     merchant_id: config.merchantId,
      //     amount,
      //     // autres paramètres
      //   }),
      // })
    }

    // Si le paiement réussit, créer la réservation
    // const booking = await prisma.bookings.create({...})

    return NextResponse.json({
      success: true,
      message: 'Paiement effectué avec succès',
      // booking_id: booking.id,
    })
  } catch (error) {
    console.error('Erreur de paiement:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du paiement' },
      { status: 500 }
    )
  }
}
```

### Étape 2 : Mettre à jour le composant PaymentButtons

Le composant `components/PaymentButtons.tsx` est déjà créé et prêt. Il suffit de décommenter et adapter la partie API dans la fonction `handlePayment`.

### Étape 3 : Tester

1. Démarrez le serveur de développement : `npm run dev`
2. Naviguez vers un événement avec des billets payants
3. Sélectionnez un billet et cliquez sur "Procéder au paiement"
4. Testez les boutons Airtel Money et Moov Money

## 📝 Notes importantes

### Sécurité
- ⚠️ **Ne jamais** exposer les clés API dans le code client
- ✅ Utilisez toujours les variables d'environnement côté serveur
- ✅ Validez tous les paiements côté serveur
- ✅ Implémentez un système de webhooks pour confirmer les paiements

### Gestion des erreurs
- Gérez les cas où le paiement échoue
- Implémentez un système de retry pour les paiements
- Loggez toutes les transactions pour audit

### Webhooks
Configurez des webhooks pour recevoir les confirmations de paiement :

```typescript
// app/api/payments/webhook/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  // Vérifier la signature du webhook
  // Mettre à jour le statut de la réservation
  // Envoyer un email de confirmation
}
```

## 🔍 Documentation API

### Airtel Money
- [Documentation officielle](https://developer.airtelmoney.com/docs)
- Endpoint de paiement : `POST /api/v1/payment`
- Format de réponse : JSON

### Moov Money
- [Documentation officielle](https://developer.moovmoney.com/docs)
- Endpoint de paiement : `POST /api/v1/payment`
- Format de réponse : JSON

## ✅ Checklist d'intégration

- [ ] Obtenir les clés API Airtel Money
- [ ] Obtenir les clés API Moov Money
- [ ] Ajouter les variables d'environnement
- [ ] Créer la route API `/api/payments/process`
- [ ] Implémenter l'appel API Airtel Money
- [ ] Implémenter l'appel API Moov Money
- [ ] Tester les paiements en mode sandbox
- [ ] Configurer les webhooks
- [ ] Tester les paiements en production
- [ ] Documenter les procédures de support

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation des APIs
2. Contactez le support technique
3. Vérifiez les logs serveur pour les erreurs

