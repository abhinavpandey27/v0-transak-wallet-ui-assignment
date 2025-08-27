export interface TestScenario {
  name: string
  description: string
  setup: () => void
  expectedBehavior: string
}

export class DepositFlowTester {
  private originalFetch: typeof fetch
  private mockResponses: Map<string, any> = new Map()
  private networkDelay = 0
  private errorRate = 0

  constructor() {
    this.originalFetch = global.fetch
  }

  // Mock API responses for testing
  setMockResponse(endpoint: string, response: any) {
    this.mockResponses.set(endpoint, response)
  }

  // Simulate network conditions
  setNetworkDelay(ms: number) {
    this.networkDelay = ms
  }

  setErrorRate(rate: number) {
    this.errorRate = Math.max(0, Math.min(1, rate))
  }

  // Install mock fetch
  enableMocking() {
    global.fetch = this.createMockFetch()
  }

  // Restore original fetch
  disableMocking() {
    global.fetch = this.originalFetch
  }

  private createMockFetch() {
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // Simulate network delay
      if (this.networkDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.networkDelay))
      }

      // Simulate random errors
      if (Math.random() < this.errorRate) {
        throw new Error("Network error (simulated)")
      }

      const url = typeof input === "string" ? input : input.toString()

      // Check for mock responses
      for (const [endpoint, response] of this.mockResponses) {
        if (url.includes(endpoint)) {
          return new Response(JSON.stringify(response), {
            status: response.status || 200,
            headers: { "Content-Type": "application/json" },
          })
        }
      }

      // Fall back to original fetch
      return this.originalFetch(input, init)
    }
  }

  // Predefined test scenarios
  getTestScenarios(): TestScenario[] {
    return [
      {
        name: "Happy Path",
        description: "Complete deposit flow with no errors",
        setup: () => {
          this.setErrorRate(0)
          this.setNetworkDelay(500)
          this.setMockResponse("quote", {
            rate: 0.0004,
            estimatedAmount: 0.4,
            fees: { transactionFee: 10, networkFee: 2.5, totalFee: 12.5 },
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            quoteId: "quote_test_123",
          })
          this.setMockResponse("bank-details", {
            bankName: "Test Bank",
            beneficiaryName: "Test Beneficiary",
            iban: "GB41TEST12345678901234",
            bankAddress: "123 Test Street, Test City",
            bankCountry: "United Kingdom",
            walletAddress: "0x1234567890abcdef",
            reference: "REF_TEST_123",
          })
          this.setMockResponse("verification", {
            status: "success",
            transactionId: "txn_test_123",
            receivedAmount: 1000,
            tokenAmount: 0.4,
          })
        },
        expectedBehavior: "User should be able to complete entire flow successfully",
      },
      {
        name: "Network Errors",
        description: "Test behavior with intermittent network failures",
        setup: () => {
          this.setErrorRate(0.3)
          this.setNetworkDelay(2000)
        },
        expectedBehavior: "Should show loading states and retry failed requests",
      },
      {
        name: "Validation Errors",
        description: "Test form validation and error messages",
        setup: () => {
          this.setErrorRate(0)
          this.setMockResponse("quote", {
            status: 400,
            error: "MIN_AMOUNT_ERROR",
            message: "Minimum deposit amount is 10",
          })
        },
        expectedBehavior: "Should show validation errors and prevent progression",
      },
      {
        name: "API Service Errors",
        description: "Test handling of API service unavailability",
        setup: () => {
          this.setErrorRate(0)
          this.setMockResponse("quote", {
            status: 503,
            error: "SERVICE_UNAVAILABLE",
            message: "Quote service temporarily unavailable",
          })
        },
        expectedBehavior: "Should show service error messages and retry options",
      },
      {
        name: "Verification Timeout",
        description: "Test behavior when verification takes too long",
        setup: () => {
          this.setErrorRate(0)
          this.setNetworkDelay(1000)
          this.setMockResponse("verification", {
            status: "failed",
            transactionId: "txn_test_timeout",
            failureReason: "Verification timeout - payment not received",
          })
        },
        expectedBehavior: "Should show timeout error and recovery options",
      },
      {
        name: "Slow Network",
        description: "Test behavior with very slow network conditions",
        setup: () => {
          this.setErrorRate(0)
          this.setNetworkDelay(5000)
        },
        expectedBehavior: "Should show loading states and remain responsive",
      },
    ]
  }

  // Utility methods for testing specific states
  simulateQuoteError() {
    this.setMockResponse("quote", {
      status: 400,
      error: "QUOTE_ERROR",
      message: "Unable to generate quote",
    })
  }

  simulateBankDetailsError() {
    this.setMockResponse("bank-details", {
      status: 503,
      error: "BANK_SERVICE_ERROR",
      message: "Bank details service unavailable",
    })
  }

  simulateVerificationFailure() {
    this.setMockResponse("verification", {
      status: "failed",
      transactionId: "txn_failed_123",
      failureReason: "Payment verification failed",
    })
  }

  // Reset all mocks
  reset() {
    this.mockResponses.clear()
    this.setErrorRate(0)
    this.setNetworkDelay(0)
    this.disableMocking()
  }
}

// Global instance for easy access
export const depositTester = new DepositFlowTester()

// Development helper functions
export const testHelpers = {
  // Simulate different user scenarios
  simulateSlowUser: () => {
    console.log("🐌 Simulating slow user input...")
    depositTester.setNetworkDelay(3000)
  },

  simulateNetworkIssues: () => {
    console.log("📡 Simulating network issues...")
    depositTester.setErrorRate(0.2)
    depositTester.setNetworkDelay(2000)
  },

  simulatePerfectConditions: () => {
    console.log("✨ Simulating perfect conditions...")
    depositTester.setErrorRate(0)
    depositTester.setNetworkDelay(200)
  },

  // Test specific error scenarios
  testValidationErrors: () => {
    console.log("⚠️ Testing validation errors...")
    depositTester.simulateQuoteError()
  },

  testServiceErrors: () => {
    console.log("🚫 Testing service errors...")
    depositTester.simulateBankDetailsError()
  },

  testVerificationFailure: () => {
    console.log("❌ Testing verification failure...")
    depositTester.simulateVerificationFailure()
  },

  // Reset everything
  resetTests: () => {
    console.log("🔄 Resetting all test conditions...")
    depositTester.reset()
  },
}

// Make test helpers available globally in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  ;(window as any).depositTestHelpers = testHelpers
}
