"use client"

import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { ArrowRight, Building2, UserCheck, Hash, MapPin, Globe, Wallet, X, CreditCard, User } from "lucide-react"
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
  icon: string // Added icon property
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
      {/* Amount Input Section */}
      <div className="text-center mb-8 px-6 py-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="flex justify-between mb-4 items-center">
          <span className="text-gray-600 dark:text-gray-300 text-base">You are Depositing</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Available: {selectedCurrency.symbol}10,000.00
          </span>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.00"
            className="text-4xl font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none text-center w-full placeholder-transparent"
          />
          <span className="text-4xl font-semibold text-gray-300 dark:text-gray-600">
            {selectedCurrency.symbol}
          </span>
          <span
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-semibold text-gray-900 dark:text-white pointer-events-none"
            style={{ left: 'calc(50% - 20px)' }}
          >
            {selectedCurrency.symbol}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          ≈ $1,435.20 USD
        </div>
      </div>

      {/* Description Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (Optional)
        </label>
        <input
          type="text"
          value={depositDescription}
          onChange={(e) => setDepositDescription(e.target.value)}
          placeholder="What's this deposit for?"
          className="text-gray-500 dark:text-gray-400 text-base mb-8 bg-transparent border-none outline-none text-center w-full placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Token Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Token to Receive
        </label>
        <div
          onClick={() => setShowTokenDialog(true)}
          className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          {selectedToken ? (
            <div className="flex items-center gap-3">
              <img src={selectedToken.icon} alt={selectedToken.name} className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Choose a token</div>
                <div className="font-medium text-gray-500 dark:text-gray-400 text-lg">Select your token</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-300 text-lg font-bold">+</span>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Choose a token</div>
                <div className="font-medium text-gray-500 dark:text-gray-400 text-lg">Select your token</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* You Will Get Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-green-600 dark:text-green-400 text-lg font-bold">→</span>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300">You will get</div>
            <div className="font-semibold text-gray-900 dark:text-white text-lg">
              {selectedToken ? `${depositAmount || '0.00'} ${selectedToken.symbol}` : 'Select token first'}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="space-y-0 mb-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <CreditCard className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Name</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Simulator Bank</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-sm">Beneficiary Name</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Doe Jane</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Hash className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-sm">IBAN / Account</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">GB41SEOU19870010404544</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <MapPin className="w-3 h-3 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-sm">Bank address</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm text-right">
            Malta
          </span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <Globe className="w-3 h-3 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-sm">Bank country</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Malta</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <Wallet className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-sm">Wallet Address</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            0x742d35...a3b4
          </span>
        </div>
      </div>

      {/* Deposit Button */}
      <CustomButton variant="primary" size="lg" fullWidth className="text-base">
        Deposit {selectedCurrency.symbol}{depositAmount || '0.00'}
      </CustomButton>

      {/* Token Selection Dialog */}
      {showTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-sm mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Token</h3>
              <button
                onClick={() => setShowTokenDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
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
                    selectedToken?.symbol === token.symbol
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <img src={getCryptoLogo(token.symbol) || "/placeholder.svg"} alt={token.name} className="w-10 h-10" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{token.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</div>
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
