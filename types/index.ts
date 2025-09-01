export interface Currency {
  code: string
  symbol: string
  name: string
}

export interface Token {
  symbol: string
  name: string
  color: string
  rate: number
}

export interface Transaction {
  id: number
  type: string
  currency: string
  symbol: string
  date: string
  transactionId: string
  amount: string
  crypto: string
  status: string
  transactionType: string
  description?: string
}

export interface BankAccount {
  id: number
  bankName: string
  iban: string
  beneficiary: string
  address: string
}

export interface ProfileData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  dob: string
  kyc_status: "pending" | "verified" | "rejected"
  address: {
    line1: string
    city: string
    state: string
    postal_code: string
    country_name: string
    country_code: string
  }
  avatar: {
    type: string
    background_color: string
  }
}

export interface AvatarOption {
  emoji: string
  color: string
}

// Crypto holdings shown in the Crypto Wallet tab
export interface CryptoHolding {
  symbol: string // e.g., ETH
  name: string // e.g., Ethereum
  network: string // e.g., ethereum, polygon
  iconUrl?: string // optional explicit icon; symbol-based fallback used otherwise
  priceEur: number // current price in EUR
  changePct24h: number // 24h change in percent; positive/negative
  quantity: number // user balance quantity
}
