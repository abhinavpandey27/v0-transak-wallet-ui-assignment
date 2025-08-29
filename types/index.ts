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
