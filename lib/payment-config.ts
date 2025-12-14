/**
 * Configuration pour les paiements mobiles
 * 
 * Pour activer les paiements, ajoutez vos clés API dans .env.local :
 * 
 * AIRTEL_MONEY_API_KEY=your_airtel_api_key
 * AIRTEL_MONEY_API_SECRET=your_airtel_api_secret
 * AIRTEL_MONEY_MERCHANT_ID=your_merchant_id
 * 
 * MOOV_MONEY_API_KEY=your_moov_api_key
 * MOOV_MONEY_API_SECRET=your_moov_api_secret
 * MOOV_MONEY_MERCHANT_ID=your_merchant_id
 */

export const paymentConfig = {
  airtel: {
    enabled: !!process.env.NEXT_PUBLIC_AIRTEL_MONEY_ENABLED || false,
    apiKey: process.env.AIRTEL_MONEY_API_KEY || '',
    apiSecret: process.env.AIRTEL_MONEY_API_SECRET || '',
    merchantId: process.env.AIRTEL_MONEY_MERCHANT_ID || '',
    apiUrl: process.env.AIRTEL_MONEY_API_URL || 'https://api.airtelmoney.com',
  },
  moov: {
    enabled: !!process.env.NEXT_PUBLIC_MOOV_MONEY_ENABLED || false,
    apiKey: process.env.MOOV_MONEY_API_KEY || '',
    apiSecret: process.env.MOOV_MONEY_API_SECRET || '',
    merchantId: process.env.MOOV_MONEY_MERCHANT_ID || '',
    apiUrl: process.env.MOOV_MONEY_API_URL || 'https://api.moovmoney.com',
  },
}

export const isPaymentEnabled = (method: 'airtel' | 'moov'): boolean => {
  return paymentConfig[method].enabled
}

