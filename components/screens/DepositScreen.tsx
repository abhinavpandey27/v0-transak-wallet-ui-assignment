"use client"
import { CustomButton } from "@/components/ui/custom-button"
import { ArrowRight, Hash, MapPin, Globe, Wallet, X, CreditCard, User } from "lucide-react"
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
      <div className="flex justify-between items-center mb-8">
        <span className="text-gray-600 dark:text-gray-300 text-base">You are Depositing</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            availableCurrencies={availableCurrencies}
          />
        </div>
      </div>

      <div className="text-center mb-8 px-6 py-12 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-6xl font-bold text-gray-900 dark:text-white">{selectedCurrency.symbol}</span>
          <input
            type="text"
            value={depositAmount || "30"}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="text-6xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none w-32"
          />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">≈ $1,435.20 USD</div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (Optional)
        </label>
        <div className="text-center">
          <input
            type="text"
            value={depositDescription}
            onChange={(e) => setDepositDescription(e.target.value)}
            placeholder="What's this deposit for?"
            className="w-full text-center text-gray-500 dark:text-gray-400 text-base bg-gray-100 dark:bg-gray-800 border-none outline-none py-3 px-4 rounded-lg placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
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
              <img
                src={selectedToken.icon || "/placeholder.svg"}
                alt={selectedToken.name}
                className="w-8 h-8 rounded-full"
              />
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
            <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300">You will get</div>
            <div className="font-semibold text-gray-900 dark:text-white text-lg">
              {selectedToken ? `${calculateTokenAmount()} ${selectedToken.symbol}` : "Select token first"}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-0 mb-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Name</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Simulator Bank</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">Beneficiary Name</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Doe Jane</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">IBAN / Account</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">GB41SEOU19870010404544</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Address</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm text-right">
            123 Financial District, Valletta VLT 1234, Malta
          </span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Country</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">Malta</span>
        </div>
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">Wallet Address</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">0x742d35...a3b4</span>
        </div>
      </div>

      {/* Deposit Button */}
      <CustomButton variant="primary" size="lg" fullWidth className="text-base">
        Deposit {selectedCurrency.symbol}
        {depositAmount || "30"}
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
