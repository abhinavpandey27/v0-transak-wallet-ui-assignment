export interface QuoteRequest {
  amount: number
  fromCurrency: string
  toCurrency: string
  tokenId: string
}

export interface QuoteResponse {
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

export interface BankDetailsRequest {
  amount: number
  currency: string
  tokenId: string
  quoteId: string
}

export interface BankDetailsResponse {
  bankName: string
  beneficiaryName: string
  iban: string
  bankAddress: string
  bankCountry: string
  walletAddress: string
  reference: string
  expiresAt: string
}

export interface VerificationRequest {
  transactionId: string
  amount: number
  currency: string
  reference: string
}

export interface VerificationResponse {
  status: "pending" | "success" | "failed"
  transactionId: string
  receivedAmount?: number
  tokenAmount?: number
  completedAt?: string
  failureReason?: string
}

export class DepositApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any,
  ) {
    super(message)
    this.name = "DepositApiError"
  }
}

// Simulated API endpoints with realistic delays and error scenarios
export const depositApi = {
  async getQuote(request: QuoteRequest): Promise<QuoteResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))

    // Simulate occasional API errors
    if (Math.random() < 0.1) {
      throw new DepositApiError("Quote service temporarily unavailable", "QUOTE_SERVICE_ERROR", 503)
    }

    // Validate request
    if (request.amount < 10) {
      throw new DepositApiError("Minimum deposit amount is 10", "MIN_AMOUNT_ERROR", 400)
    }

    if (request.amount > 10000) {
      throw new DepositApiError("Maximum deposit amount is 10,000", "MAX_AMOUNT_ERROR", 400)
    }

    // Currency to USD conversion rates
    const currencyToUSD: Record<string, number> = {
      USD: 1.0,
      EUR: 1.08,
      GBP: 1.27,
      INR: 0.012,
      CAD: 0.74,
      AUD: 0.66,
      JPY: 0.0067,
      CHF: 1.11,
      CNY: 0.14,
      KRW: 0.00076,
    }

    // Crypto token prices in USD
    const tokenPricesUSD: Record<string, number> = {
      BTC: 43000,
      ETH: 2300,
      USDT: 1.0,
      USDC: 1.0,
      ADA: 0.38,
      DOT: 5.2,
      MATIC: 0.75,
      LINK: 14.5,
    }

    const usdRate = currencyToUSD[request.fromCurrency] || 1.0
    const tokenPriceUSD = tokenPricesUSD[request.toCurrency] || 2300

    // Convert fiat amount to USD, then to crypto tokens
    const amountInUSD = request.amount * usdRate
    const estimatedAmount = amountInUSD / tokenPriceUSD
    const rate = estimatedAmount / request.amount // Rate per unit of fiat currency

    const transactionFee = request.amount * 0.01 // 1%
    const networkFee = 2.5

    return {
      rate,
      estimatedAmount,
      fees: {
        transactionFee,
        networkFee,
        totalFee: transactionFee + networkFee,
      },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      quoteId: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  },

  async getBankDetails(request: BankDetailsRequest): Promise<BankDetailsResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

    // Simulate occasional API errors
    if (Math.random() < 0.05) {
      throw new DepositApiError("Bank details service unavailable", "BANK_SERVICE_ERROR", 503)
    }

    return {
      bankName: "Simulator Bank",
      beneficiaryName: "Transak Europe Ltd",
      iban: `GB41SEOU${Math.random().toString().substr(2, 14)}`,
      bankAddress: "The Bower, 207-211 Old Street, London, England",
      bankCountry: "United Kingdom",
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      reference: `TXN_${Date.now()}_${request.quoteId.split("_")[2]}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    }
  },

  async initiateVerification(request: VerificationRequest): Promise<{ transactionId: string }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate occasional API errors
    if (Math.random() < 0.03) {
      throw new DepositApiError("Verification service unavailable", "VERIFICATION_SERVICE_ERROR", 503)
    }

    return {
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  },

  async checkVerificationStatus(transactionId: string): Promise<VerificationResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Simulate occasional API errors
    if (Math.random() < 0.05) {
      throw new DepositApiError("Verification status check failed", "STATUS_CHECK_ERROR", 503)
    }

    // Simulate verification process (90% success rate after delay)
    const isSuccess = Math.random() < 0.9

    if (isSuccess) {
      return {
        status: "success",
        transactionId,
        receivedAmount: 1000, // Mock received amount
        tokenAmount: 0.4, // Mock token amount
        completedAt: new Date().toISOString(),
      }
    } else {
      return {
        status: "failed",
        transactionId,
        failureReason: "Payment not received within expected timeframe",
      }
    }
  },
}
