export interface WithdrawalQuoteRequest {
  tokenAmount: number
  fromToken: string
  toCurrency: string
  tokenId: string
}

export interface WithdrawalQuoteResponse {
  rate: number
  estimatedAmount: number
  fees: {
    transactionFee: number
    networkFee: number
    totalFee: number
  }
  expiresAt: string
  quoteId: string
}

export interface WalletAddressRequest {
  tokenId: string
  currency: string
  amount: number
  quoteId: string
  bankAccountId?: string
}

export interface WalletAddressResponse {
  walletAddress: string
  qrCodeUrl: string
  expiresAt: string
  transactionId: string
  estimatedProcessingTime: number // in minutes
}

export interface WithdrawalStatusRequest {
  transactionId: string
  walletAddress: string
}

export interface WithdrawalStatusResponse {
  status: "pending" | "received" | "processing" | "completed" | "failed"
  transactionId: string
  receivedTokenAmount?: number
  fiatAmount?: number
  completedAt?: string
  failureReason?: string
  estimatedCompletionTime?: string
}

export interface BankAccount {
  id: string
  bankName: string
  beneficiaryName: string
  iban: string
  bankAddress: string
  bankCountry: string
  isDefault: boolean
}

export class WithdrawalApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any,
  ) {
    super(message)
    this.name = "WithdrawalApiError"
  }
}

// Simulated API endpoints with realistic delays and error scenarios
export const withdrawalApi = {
  async getQuote(request: WithdrawalQuoteRequest): Promise<WithdrawalQuoteResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

    // Simulate occasional API errors
    if (Math.random() < 0.08) {
      throw new WithdrawalApiError("Quote service temporarily unavailable", "QUOTE_SERVICE_ERROR", 503)
    }

    // Validate request
    if (request.tokenAmount < 0.001) {
      throw new WithdrawalApiError("Minimum withdrawal amount is 0.001 tokens", "MIN_AMOUNT_ERROR", 400)
    }

    if (request.tokenAmount > 100) {
      throw new WithdrawalApiError("Maximum withdrawal amount is 100 tokens", "MAX_AMOUNT_ERROR", 400)
    }

    // Mock exchange rates (inverse of deposit rates)
    const rates: Record<string, number> = {
      ETH: 2400, // 1 ETH = 2400 EUR
      BTC: 65000, // 1 BTC = 65000 EUR
      USDT: 0.98, // 1 USDT = 0.98 EUR
      USDC: 0.99, // 1 USDC = 0.99 EUR
    }

    const rate = rates[request.fromToken] || 2400
    const estimatedAmount = request.tokenAmount * rate
    const transactionFee = estimatedAmount * 0.015 // 1.5%
    const networkFee = 5.0

    return {
      rate,
      estimatedAmount: estimatedAmount - transactionFee - networkFee,
      fees: {
        transactionFee,
        networkFee,
        totalFee: transactionFee + networkFee,
      },
      expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutes
      quoteId: `withdraw_quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  },

  async generateWalletAddress(request: WalletAddressRequest): Promise<WalletAddressResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600))

    // Simulate occasional API errors
    if (Math.random() < 0.05) {
      throw new WithdrawalApiError("Wallet generation service unavailable", "WALLET_SERVICE_ERROR", 503)
    }

    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`
    const transactionId = `withdraw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      walletAddress,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(walletAddress)}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      transactionId,
      estimatedProcessingTime: 5, // 5 minutes
    }
  },

  async checkWithdrawalStatus(request: WithdrawalStatusRequest): Promise<WithdrawalStatusResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800))

    if (Math.random() < 0.005) {
      throw new WithdrawalApiError("Status check service unavailable", "STATUS_SERVICE_ERROR", 503)
    }

    // Simulate withdrawal process stages
    const random = Math.random()

    if (random < 0.3) {
      return {
        status: "pending",
        transactionId: request.transactionId,
        estimatedCompletionTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      }
    } else if (random < 0.6) {
      return {
        status: "received",
        transactionId: request.transactionId,
        receivedTokenAmount: 0.1, // Mock received amount
        estimatedCompletionTime: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
      }
    } else if (random < 0.85) {
      return {
        status: "processing",
        transactionId: request.transactionId,
        receivedTokenAmount: 0.1,
        estimatedCompletionTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
      }
    } else if (random < 0.95) {
      return {
        status: "completed",
        transactionId: request.transactionId,
        receivedTokenAmount: 0.1,
        fiatAmount: 456, // Mock fiat amount
        completedAt: new Date().toISOString(),
      }
    } else {
      return {
        status: "failed",
        transactionId: request.transactionId,
        failureReason: "Transaction timeout - tokens not received within expected timeframe",
      }
    }
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

    if (Math.random() < 0.003) {
      throw new WithdrawalApiError("Bank accounts service unavailable", "BANK_ACCOUNTS_ERROR", 503)
    }

    return [
      {
        id: "bank_1",
        bankName: "Simulator Bank",
        beneficiaryName: "Doe Jane",
        iban: "GB41SEOU19870010404544",
        bankAddress: "The Bower, 207-211 Old Street, London, England",
        bankCountry: "Malta",
        isDefault: true,
      },
      {
        id: "bank_2",
        bankName: "Test Bank Europe",
        beneficiaryName: "Doe Jane",
        iban: "DE89370400440532013000",
        bankAddress: "Hauptstraße 123, Berlin, Germany",
        bankCountry: "Germany",
        isDefault: false,
      },
    ]
  },

  async getAvailableTokens() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [
      { id: "eth", symbol: "ETH", name: "Ethereum", icon: "⟠", balance: 2.5 },
      { id: "btc", symbol: "BTC", name: "Bitcoin", icon: "₿", balance: 0.15 },
      { id: "usdt", symbol: "USDT", name: "Tether", icon: "₮", balance: 1000 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "$", balance: 500 },
    ]
  },

  async getAvailableCurrencies() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return [
      { code: "EUR", name: "Euro", flag: "🇪🇺" },
      { code: "USD", name: "US Dollar", flag: "🇺🇸" },
      { code: "GBP", name: "British Pound", flag: "🇬🇧" },
      { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    ]
  },
}
