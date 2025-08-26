"use client"

import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { ArrowRight, Building2, UserCheck, Hash, MapPin, Globe, Wallet, X } from "lucide-react"
import CurrencySelector from "@/components/shared/CurrencySelector"

interface Currency {
  code: string
  symbol: string
  name: string
}

interface Token {
  symbol: string
  name: string
  color: string
  rate: number
}

interface DepositScreenProps {
  depositAmount: string
  setDepositAmount: (amount: string) => void
  depositDescription: string
  setDepositDescription: (description: string) => void
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  selectedToken: Token | null
  setSelectedToken: (token: Token | null) => void
  availableCurrencies: Currency[]
  cryptoTokens: Token[]
  showTokenDialog: boolean
  setShowTokenDialog: (show: boolean) => void
}

export default function DepositScreen({
  depositAmount,
  setDepositAmount,
  depositDescription,
  setDepositDescription,
  selectedCurrency,
  setSelectedCurrency,
  selectedToken,
  setSelectedToken,
  availableCurrencies,
  cryptoTokens,
  showTokenDialog,
  setShowTokenDialog,
}: DepositScreenProps) {
  const getCryptoLogo = (symbol: string) => {
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${symbol.toLowerCase()}.svg`
  }

  const calculateTokenAmount = () => {
    if (!selectedToken || !depositAmount) return "0"
    const amount = Number.parseFloat(depositAmount)
    const tokenAmount = amount * selectedToken.rate
    return tokenAmount.toFixed(6)
  }

  return (
    <div className="max-w-[640px] w-full">
      {/* You are Depositing Section */}
      <div className="text-center mb-8 px-6 py-6 bg-gray-100 rounded-xl">
        <div className="flex justify-between mb-4 items-center">
          <span className="text-gray-600 text-base">You are Depositing</span>
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            availableCurrencies={availableCurrencies}
          />
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => {
              // Only allow numbers and decimal point
              const value = e.target.value.replace(/[^0-9.]/g, "")
              setDepositAmount(value)
            }}
            placeholder=""
            className="text-6xl font-semibold text-gray-900 bg-transparent border-none outline-none text-center w-full placeholder-transparent"
            style={{ caretColor: "#374151" }}
          />
          {depositAmount === "" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-6xl font-semibold text-gray-300">{selectedCurrency.symbol} 5</span>
            </div>
          )}
          {depositAmount !== "" && (
            <span
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-semibold text-gray-900 pointer-events-none"
              style={{ marginLeft: `-${depositAmount.length * 1.8}rem` }}
            >
              {selectedCurrency.symbol}
            </span>
          )}
        </div>

        <input
          type="text"
          value={depositDescription}
          onChange={(e) => setDepositDescription(e.target.value)}
          placeholder="Add Description"
          className="text-gray-500 text-base mb-8 bg-transparent border-none outline-none text-center w-full placeholder-gray-500"
        />

        {/* You will get Card */}
        <Card
          className="p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setShowTokenDialog(true)}
        >
          {!selectedToken ? (
            // Empty state
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <span className="text-gray-400 text-lg font-bold">+</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-600">Choose a token</div>
                  <div className="font-medium text-gray-500 text-lg">Select your token</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          ) : (
            // Selected token state
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={getCryptoLogo(selectedToken.symbol) || "/placeholder.svg"}
                  alt={selectedToken.name}
                  className="w-12 h-12"
                />
                <div className="text-left">
                  <div className="text-sm text-gray-600">You will get</div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {calculateTokenAmount()} {selectedToken.symbol}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </Card>
      </div>

      {/* Bank Details Section */}
      <div className="space-y-0 mb-8 rounded-xl overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center py-3 px-4 bg-white">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Bank Name</span>
          </div>
          <span className="font-medium text-gray-900">Simulator Bank</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Beneficiary Name</span>
          </div>
          <span className="font-medium text-gray-900">Doe Jane</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-white">
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">IBAN / Account</span>
          </div>
          <span className="font-medium text-gray-900">GB41SEOU19870010404544</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Bank address</span>
          </div>
          <span className="font-medium text-gray-900 text-right">The Bower, 207-211 Old Street, London, England</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-white">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Bank country</span>
          </div>
          <span className="font-medium text-gray-900">Malta</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-white">
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Wallet Address</span>
          </div>
          <span className="font-medium text-gray-900">0x973fF8EcFB22c4Fe69Db152f327587DDfA1B</span>
        </div>
      </div>

      {/* Simulate Deposit Button */}
      <CustomButton variant="primary" size="lg" fullWidth>
        Simulate Deposit
      </CustomButton>

      {/* Token Selection Dialog */}
      {showTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-sm mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Token</h3>
              <button onClick={() => setShowTokenDialog(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {cryptoTokens.map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => {
                    setSelectedToken(token)
                    setShowTokenDialog(false)
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedToken?.symbol === token.symbol ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <img src={getCryptoLogo(token.symbol) || "/placeholder.svg"} alt={token.name} className="w-10 h-10" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{token.name}</div>
                    <div className="text-sm text-gray-500">{token.symbol}</div>
                  </div>
                  {selectedToken?.symbol === token.symbol && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
