"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import React from "react"
import {
  Home,
  User,
  CreditCard,
  Shield,
  Settings,
  LogOut,
  Download,
  Upload,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertTriangle,
  X,
  ChevronDown,
  ArrowRight,
  Building2,
  UserCheck,
  Hash,
  MapPin,
  Globe,
  Wallet,
  Filter,
  MoreHorizontal,
  Sun,
  Moon,
  Edit,
  Mail,
  Phone,
  Calendar,
  Building,
} from "lucide-react"

export default function WalletDashboard() {
  const [activeTab, setActiveTab] = useState("fiat")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentScreen, setCurrentScreen] = useState("wallet") // wallet, deposit, withdraw, profile
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [depositDescription, setDepositDescription] = useState("")
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState({ code: "EUR", symbol: "€", name: "Euro" })
  const [selectedToken, setSelectedToken] = useState(null) // null means no token selected
  const [showTokenDialog, setShowTokenDialog] = useState(false)

  const [limitsActiveTab, setLimitsActiveTab] = useState("daily") // daily, monthly, yearly
  const [limitsCurrency, setLimitsCurrency] = useState({ code: "EUR", symbol: "€", name: "Euro" })
  const [showLimitsCurrencyDialog, setShowLimitsCurrencyDialog] = useState(false)

  const [selectedSendingToken, setSelectedSendingToken] = useState({
    symbol: "ETH",
    name: "Ethereum",
    color: "#627EEA",
  })
  const [selectedWithdrawCurrency, setSelectedWithdrawCurrency] = useState({ code: "EUR", symbol: "€", name: "Euro" })
  const [selectedBankAccount, setSelectedBankAccount] = useState(0) // Index of selected bank account
  const [showSendingTokenDialog, setShowSendingTokenDialog] = useState(false)
  const [showWithdrawCurrencyDialog, setShowWithdrawCurrencyDialog] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const [profileData, setProfileData] = useState<{
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
  }>({
    id: "user_001",
    first_name: "Sam",
    last_name: "Lee",
    email: "samlee.mobbin+1@gmail.com",
    phone: "+1 (555) 123-4567",
    dob: "1990-05-15",
    kyc_status: "verified",
    address: {
      line1: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      postal_code: "10001",
      country_name: "United States",
      country_code: "US",
    },
    avatar: {
      type: "😊",
      background_color: "from-orange-400 to-yellow-500",
    },
  })

  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [showProfileEditDialog, setShowProfileEditDialog] = useState(false)

  const avatarOptions = [
    { emoji: "😊", color: "from-orange-400 to-yellow-500" },
    { emoji: "🚀", color: "from-blue-400 to-purple-500" },
    { emoji: "🌟", color: "from-yellow-400 to-orange-500" },
    { emoji: "🎯", color: "from-green-400 to-blue-500" },
    { emoji: "💎", color: "from-purple-400 to-pink-500" },
    { emoji: "🔥", color: "from-red-400 to-orange-500" },
    { emoji: "⚡", color: "from-cyan-400 to-blue-500" },
    { emoji: "🎨", color: "from-pink-400 to-purple-500" },
  ]

  const availableCurrencies = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  ]

  const cryptoTokens = [
    { symbol: "BTC", name: "Bitcoin", color: "#F7931A", rate: 0.000015 }, // EUR to BTC rate
    { symbol: "ETH", name: "Ethereum", color: "#627EEA", rate: 0.0002474 }, // EUR to ETH rate
    { symbol: "ADA", name: "Cardano", color: "#0033AD", rate: 2.5 }, // EUR to ADA rate
    { symbol: "SOL", name: "Solana", color: "#9945FF", rate: 0.008 }, // EUR to SOL rate
    { symbol: "DOT", name: "Polkadot", color: "#E6007A", rate: 0.15 }, // EUR to DOT rate
    { symbol: "MATIC", name: "Polygon", color: "#8247E5", rate: 1.2 }, // EUR to MATIC rate
    { symbol: "AVAX", name: "Avalanche", color: "#E84142", rate: 0.025 }, // EUR to AVAX rate
    { symbol: "LINK", name: "Chainlink", color: "#375BD2", rate: 0.07 }, // EUR to LINK rate
    { symbol: "UNI", name: "Uniswap", color: "#FF007A", rate: 0.12 }, // EUR to UNI rate
    { symbol: "LTC", name: "Litecoin", color: "#BFBBBB", rate: 0.01 }, // EUR to LTC rate
    { symbol: "XRP", name: "Ripple", color: "#23292F", rate: 1.8 }, // EUR to XRP rate
    { symbol: "ALGO", name: "Algorand", color: "#000000", rate: 4.5 }, // EUR to ALGO rate
  ]

  const transactions = [
    {
      id: 1,
      type: "Buying",
      currency: "Bitcoin",
      symbol: "BTC",
      date: "12th August 2025, 4:45 PM",
      transactionId: "20250812-BTC001",
      amount: "150 EUR",
      crypto: "0.0025 BTC",
      status: "completed",
      transactionType: "buy",
    },
    {
      id: 2,
      type: "Ethereum",
      currency: "Ethereum",
      symbol: "ETH",
      date: "12th August 2025, 3:30 PM",
      transactionId: "20250812-ETH002",
      amount: "75 EUR",
      crypto: "0.025 ETH",
      status: "completed",
      transactionType: "withdraw",
    },
    {
      id: 3,
      type: "Solana",
      currency: "Solana",
      symbol: "SOL",
      date: "12th August 2025, 2:15 PM",
      transactionId: "20250812-SOL003",
      amount: "45 EUR",
      crypto: "1.25 SOL",
      status: "completed",
      transactionType: "withdraw",
    },
    {
      id: 4,
      type: "Cardano",
      currency: "Cardano",
      symbol: "ADA",
      date: "12th August 2025, 1:00 PM",
      transactionId: "20250812-ADA004",
      amount: "30 EUR",
      crypto: "85 ADA",
      status: "pending",
      transactionType: "deposit",
    },
    {
      id: 5,
      type: "Polygon",
      currency: "Polygon",
      symbol: "MATIC",
      date: "12th August 2025, 6:45 PM",
      transactionId: "20250811-MATIC005",
      amount: "25 EUR",
      crypto: "35 MATIC",
      status: "error",
      transactionType: "withdraw",
    },
    {
      id: 6,
      type: "Chainlink",
      currency: "Chainlink",
      symbol: "LINK",
      date: "11th August 2025, 4:30 PM",
      transactionId: "20250811-LINK006",
      amount: "60 EUR",
      crypto: "4.2 LINK",
      status: "completed",
      transactionType: "deposit",
    },
    {
      id: 7,
      type: "Avalanche",
      currency: "Avalanche",
      symbol: "AVAX",
      date: "11th August 2025, 2:15 PM",
      transactionId: "20250811-AVAX007",
      amount: "40 EUR",
      crypto: "1.8 AVAX",
      status: "warning",
      transactionType: "withdraw",
    },
  ]

  const cryptoTransactions = [
    {
      id: 1,
      type: "Received",
      currency: "Uniswap",
      symbol: "UNI",
      date: "12th August 2025, 3:30 PM",
      transactionId: "UNI-20250812-001",
      amount: "12 UNI",
      crypto: "85 EUR",
      status: "completed",
      transactionType: "deposit",
    },
    {
      id: 2,
      type: "Sent",
      currency: "Polkadot",
      symbol: "DOT",
      date: "11th August 2025, 2:15 PM",
      transactionId: "DOT-20250811-002",
      amount: "8.5 DOT",
      crypto: "65 EUR",
      status: "completed",
      transactionType: "withdraw",
    },
    {
      id: 3,
      type: "Staking",
      currency: "Algorand",
      symbol: "ALGO",
      date: "10th August 2025, 1:00 PM",
      transactionId: "ALGO-20250810-003",
      amount: "250 ALGO",
      crypto: "45 EUR",
      status: "pending",
      transactionType: "deposit",
    },
    {
      id: 4,
      type: "Swap",
      currency: "Litecoin",
      symbol: "LTC",
      date: "10th August 2025, 11:30 AM",
      transactionId: "LTC-20250810-004",
      amount: "0.75 LTC",
      crypto: "55 EUR",
      status: "completed",
      transactionType: "withdraw",
    },
  ]

  const bankAccounts = [
    {
      id: 1,
      bankName: "Simulator Bank",
      iban: "GB41SEOU19870010404544",
      beneficiary: "Doe Jane",
      address: "The Bower, 207-211 Old Street, London, England, Malta",
    },
    {
      id: 2,
      bankName: "Simulator Bank",
      iban: "GB41SEOU19870010404544",
      beneficiary: "Doe Jane",
      address: "The Bower, 207-211 Old Street, London, England, Malta",
    },
    {
      id: 3,
      bankName: "Simulator Bank",
      iban: "GB41SEOU19870010404544",
      beneficiary: "Doe Jane",
      address: "The Bower, 207-211 Old Street, London, England, Malta",
    },
  ]

  const getCryptoLogo = (symbol: string) => {
    const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${symbol.toLowerCase()}.svg`
    return iconUrl
  }

  const getStatusIndicator = (status: string, transactionType: string) => {
    const baseClasses =
      "absolute -top-1 -left-1 w-6 h-6 rounded-full border-[1.5px] border-white flex items-center justify-center shadow-sm"

    switch (status) {
      case "pending":
        return (
          <div className={`${baseClasses} bg-yellow-500`}>
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        )
      case "error":
        return (
          <div className={`${baseClasses} bg-red-500`}>
            <X className="w-4 h-4 text-white" />
          </div>
        )
      case "warning":
        return (
          <div className={`${baseClasses} bg-orange-500`}>
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        )
      case "completed":
        if (transactionType === "deposit" || transactionType === "buy") {
          return (
            <div className={`${baseClasses} bg-green-500`}>
              <ArrowUp className="w-4 h-4 text-white" />
            </div>
          )
        } else if (transactionType === "withdraw") {
          return (
            <div className={`${baseClasses} bg-green-500`}>
              <ArrowDown className="w-4 h-4 text-white" />
            </div>
          )
        }
        break
      default:
        return (
          <div className={`${baseClasses} bg-gray-400`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )
    }
  }

  const calculateTokenAmount = () => {
    if (!selectedToken || !depositAmount) return "0"
    const amount = Number.parseFloat(depositAmount)
    const tokenAmount = amount * selectedToken.rate
    return tokenAmount.toFixed(6)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const newWidth = e.clientX
    if (newWidth >= 200 && newWidth <= 400) {
      setSidebarWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing])

  const transactionLimits = {
    daily: {
      bankTransfer: { limit: 1435.2, used: 1435.2, remaining: 0 },
      creditCard: { limit: 1435.2, used: 1435.2, remaining: 0 },
    },
    monthly: {
      bankTransfer: { limit: 43056.0, used: 15000.0, remaining: 28056.0 },
      creditCard: { limit: 43056.0, used: 20000.0, remaining: 23056.0 },
    },
    yearly: {
      bankTransfer: { limit: 516720.0, used: 180000.0, remaining: 336720.0 },
      creditCard: { limit: 516720.0, used: 240000.0, remaining: 276720.0 },
    },
  }

  const formatLimitAmount = (amount) => {
    return `${limitsCurrency.symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const renderDepositScreen = () => (
    <div className="max-w-[640px] w-full">
      {/* You are Depositing Section */}
      <div className="text-center mb-8 px-6 py-6 bg-gray-100 rounded-xl">
        <div className="flex justify-between mb-4 items-center">
          <span className="text-gray-600 text-base">You are Depositing</span>
          <div
            onClick={() => setShowCurrencyDialog(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors py-1 px-1 rounded-full"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">{selectedCurrency.symbol}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">{selectedCurrency.code}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
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

      {showCurrencyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Currency</h3>
              <button onClick={() => setShowCurrencyDialog(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {availableCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency)
                    setShowCurrencyDialog(false)
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCurrency.code === currency.code ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">{currency.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{currency.code}</div>
                    <div className="text-sm text-gray-500">{currency.name}</div>
                  </div>
                  {selectedCurrency.code === currency.code && (
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

  const renderWithdrawScreen = () => (
    <div className="max-w-[640px] w-full">
      <div className="bg-gray-100 rounded-xl p-6 mb-8">
        {/* You are Sending Section */}
        <div className="flex justify-between mb-4 items-center">
          <span className="text-gray-600 text-base">You are Sending</span>
          <div
            onClick={() => {
              setShowSendingTokenDialog(true)
              setShowQRCode(false) // Reset QR visibility when token changes
            }}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors py-1 px-1 rounded-full"
          >
            <img
              src={getCryptoLogo(selectedSendingToken.symbol) || "/placeholder.svg"}
              alt={selectedSendingToken.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">{selectedSendingToken.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="flex justify-between mb-8 items-center">
          <span className="text-gray-600 text-base">You are Withdrawing in</span>
          <div
            onClick={() => {
              setShowWithdrawCurrencyDialog(true)
              setShowQRCode(false) // Reset QR visibility when currency changes
            }}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors py-1 px-1 rounded-full"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">{selectedWithdrawCurrency.symbol}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">{selectedWithdrawCurrency.code}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="text-center relative">
          {!showQRCode ? (
            <div className="relative">
              {/* Background QR hint */}
              <div className="inline-block p-8 bg-white rounded-xl mb-6 opacity-30">
                <div className="w-80 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-6xl text-gray-400">QR</div>
                </div>
              </div>
              {/* Overlay button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CustomButton variant="primary" size="lg" onClick={() => setShowQRCode(true)}>
                  Show QR Code
                </CustomButton>
              </div>
            </div>
          ) : (
            <div>
              <div className="inline-block p-8 bg-white rounded-xl mb-6 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(`${selectedSendingToken.symbol}:0x973fF8EcFB22c4Fe69Db152f327587DDfAfB?amount=1&currency=${selectedWithdrawCurrency.code}`)}`}
                  alt="Dynamic QR Code"
                  className="w-80 h-80"
                />
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <span className="text-base font-sans">0x973fF8EcFB22c4Fe69Db152f327587DDfAfB</span>
                <button
                  onClick={() => copyToClipboard("0x973fF8EcFB22c4Fe69Db152f327587DDfAfB")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bank Accounts Selection */}
      <div className="space-y-3">
        {bankAccounts.map((account, index) => (
          <div
            key={account.id}
            onClick={() => setSelectedBankAccount(index)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              selectedBankAccount === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  selectedBankAccount === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                }`}
              >
                {selectedBankAccount === index && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Bank Name</span>
                  <span className="text-sm font-medium text-gray-900">{account.bankName}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">IBAN / Account</span>
                  <span className="text-sm font-medium text-gray-900">{account.iban}</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-sm mb-1">{account.beneficiary}</div>
                  <div className="text-sm text-gray-600">{account.address}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Token Selection Dialog */}
      {showSendingTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-sm mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Token</h3>
              <button onClick={() => setShowSendingTokenDialog(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {cryptoTokens.map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => {
                    setSelectedSendingToken(token)
                    setShowSendingTokenDialog(false)
                    setShowQRCode(false)
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSendingToken.symbol === token.symbol
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <img src={getCryptoLogo(token.symbol) || "/placeholder.svg"} alt={token.name} className="w-10 h-10" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{token.name}</div>
                    <div className="text-sm text-gray-500">{token.symbol}</div>
                  </div>
                  {selectedSendingToken.symbol === token.symbol && (
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

      {/* Withdraw Currency Selection Dialog */}
      {showWithdrawCurrencyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Currency</h3>
              <button
                onClick={() => setShowWithdrawCurrencyDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {availableCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => {
                    setSelectedWithdrawCurrency(currency)
                    setShowWithdrawCurrencyDialog(false)
                    setShowQRCode(false)
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedWithdrawCurrency.code === currency.code
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">{currency.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{currency.code}</div>
                    <div className="text-sm text-gray-500">{currency.name}</div>
                  </div>
                  {selectedWithdrawCurrency.code === currency.code && (
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

  const renderWalletScreen = () => (
    <div className="max-w-[640px] w-full">
      {/* Balance Card */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-none px-6 py-6">
        <div className="text-center">
          <p className="text-gray-600 mb-2 text-left font-sans">Your Total Balance</p>
          <h2 className="text-5xl text-gray-900 mb-4 text-left font-semibold">$1435.20</h2>
          <p className="mx-auto text-left text-sm text-slate-500">
            Your Virtual Account is active to perform fiat and crypto transactions
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <CustomButton variant="primary" size="lg" onClick={() => setCurrentScreen("deposit")} className="flex-1">
          <Download className="w-5 h-5" />
          Deposit
        </CustomButton>
        <CustomButton variant="primary" size="lg" onClick={() => setCurrentScreen("withdraw")} className="flex-1">
          <Upload className="w-5 h-5" />
          Withdraw
        </CustomButton>
      </div>

      {/* Tabs and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative bg-gray-100 p-1 flex rounded-full">
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("fiat")}
            className={`rounded-full ${activeTab === "fiat" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            Fiat Account
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("crypto")}
            className={`rounded-full ${activeTab === "crypto" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            Crypto Wallet
          </CustomButton>
        </div>
        <CustomButton variant="outline" size="sm">
          <Filter className="w-4 h-4" />
          Filters
        </CustomButton>
      </div>

      {/* Transactions List */}
      <div className="transition-opacity duration-200 ease-in-out">
        {(activeTab === "fiat" ? transactions : cryptoTransactions).map((transaction, index) => (
          <div
            key={transaction.id}
            className="flex items-center p-4 bg-white rounded-lg border-gray-200 border-0 border-b px-4 justify-start gap-4 py-5"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="rounded-xl flex items-center justify-center border border-gray-100 w-16 h-16 bg-transparent border-none">
                  <img
                    src={getCryptoLogo(transaction.symbol) || "/placeholder.svg"}
                    alt={transaction.currency}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                {getStatusIndicator(transaction.status, transaction.transactionType)}
              </div>
            </div>
            <div className="text-right space-y-1 w-full">
              {/* Row 1: Date/Time vs EUR Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{transaction.date}</span>
                <span className="text-sm font-medium text-gray-900">{transaction.amount}</span>
              </div>
              {/* Row 2: Currency vs Crypto Amount */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">{transaction.currency}</span>
                <span className="text-base text-gray-900 font-semibold">{transaction.crypto}</span>
              </div>
              {/* Row 3: Full ID vs Description */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">ID: {transaction.transactionId}</span>
                <span className="text-sm text-slate-500">Sandbox Testing</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProfileScreen = () => (
    <div className="max-w-[640px] w-full">
      {/* Profile Avatar Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div
            className={`w-24 h-24 bg-gradient-to-br ${profileData.avatar.background_color} rounded-full flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => setShowAvatarDialog(true)}
          >
            <div className="text-white text-2xl">{profileData.avatar.type}</div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {profileData.first_name} {profileData.last_name}
        </h2>
        <CustomButton variant="outline" size="md" onClick={() => setShowProfileEditDialog(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Details
        </CustomButton>
      </div>

      {/* Personal Details Section */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 text-left text-base">Your Details</h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">First Name</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.first_name}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Last Name</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.last_name}</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Email</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.email}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Phone</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.phone}</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Date of Birth</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.dob}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">KYC Status</span>
            </div>
            <span
              className={`font-medium px-2 py-1 rounded-full text-xs ${
                profileData.kyc_status === "verified"
                  ? "bg-green-100 text-green-800"
                  : profileData.kyc_status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {profileData.kyc_status.charAt(0).toUpperCase() + profileData.kyc_status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 text-left text-base">Your Address</h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Street Address</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.address.line1}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">City</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.address.city}</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">State</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.address.state}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Postal Code</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.address.postal_code}</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Country</span>
            </div>
            <span className="font-medium text-gray-900">{profileData.address.country_name}</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <CustomButton
          variant="outline"
          size="lg"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </CustomButton>
      </div>

      {/* Avatar Selection Dialog */}
      {showAvatarDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Avatar</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {avatarOptions.map((option, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${
                    profileData.avatar.type === option.emoji ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() =>
                    setProfileData((prev) => ({
                      ...prev,
                      avatar: { type: option.emoji, background_color: option.color },
                    }))
                  }
                >
                  <span className="text-white text-xl">{option.emoji}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <CustomButton variant="outline" size="md" className="flex-1" onClick={() => setShowAvatarDialog(false)}>
                Cancel
              </CustomButton>
              <CustomButton variant="primary" size="md" className="flex-1" onClick={() => setShowAvatarDialog(false)}>
                Save
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderTransactionLimitsScreen = () => (
    <div className="max-w-[640px] w-full">
      <div className="mb-8">
        {/* Tab Navigation - Full Width */}
        <div className="relative bg-gray-100 p-1 flex rounded-full">
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setLimitsActiveTab("daily")}
            className={`rounded-full flex-1 ${limitsActiveTab === "daily" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            Daily Limit
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setLimitsActiveTab("monthly")}
            className={`rounded-full flex-1 ${limitsActiveTab === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            Monthly Limit
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setLimitsActiveTab("yearly")}
            className={`rounded-full flex-1 ${limitsActiveTab === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            Yearly Limit
          </CustomButton>
        </div>
      </div>

      {/* Bank Transfer Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Bank Transfer</h3>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-left">
              <div className="text-sm text-gray-600 mb-2">Limit</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatLimitAmount(transactionLimits[limitsActiveTab].bankTransfer.limit)}
              </div>
            </div>
            <div className="text-left border-l border-gray-200 pl-6">
              <div className="text-sm text-gray-600 mb-2">Used</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatLimitAmount(transactionLimits[limitsActiveTab].bankTransfer.used)}
              </div>
            </div>
            <div className="text-left border-l border-gray-200 pl-6">
              <div className="text-sm text-gray-600 mb-2">Remaining</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatLimitAmount(transactionLimits[limitsActiveTab].bankTransfer.remaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Card Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Credit and Debit Card</h3>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-left">
              <div className="text-sm text-gray-600 mb-2">Limit</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatLimitAmount(transactionLimits[limitsActiveTab].creditCard.limit)}
              </div>
            </div>
            <div className="text-left border-l border-gray-200 pl-6">
              <div className="text-sm text-gray-600 mb-2">Used</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatLimitAmount(transactionLimits[limitsActiveTab].creditCard.used)}
              </div>
            </div>
            <div className="text-left border-l border-gray-200 pl-6">
              <div className="text-sm text-gray-600 mb-2">Remaining</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatLimitAmount(transactionLimits[limitsActiveTab].creditCard.remaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 mt-8">
        Want to see limits in a currency other than {limitsCurrency.name} ({limitsCurrency.symbol})?{" "}
        <button
          onClick={() => setShowLimitsCurrencyDialog(true)}
          className="text-blue-600 hover:text-blue-700 underline font-medium"
        >
          Change Currency
        </button>
      </div>
    </div>
  )

  const getScreenTitle = () => {
    switch (currentScreen) {
      case "deposit":
        return "Deposit"
      case "withdraw":
        return "Withdraw"
      case "profile":
        return "Account"
      case "transactionLimits":
        return "Transaction Limits"
      default:
        return "Your Wallet"
    }
  }

  const currencies = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className="bg-white border-r border-gray-200 flex flex-col h-full relative"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Logo */}
        <div className="p-6 border-gray-200 flex-shrink-0 border-b-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-gray-900">Logoipsum</span>
            <MoreHorizontal className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto px-5">
          <div className="space-y-2">
            <div
              onClick={() => setCurrentScreen("wallet")}
              className={`flex items-center gap-3 rounded-lg py-3 px-4 cursor-pointer ${
                currentScreen === "wallet" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Your Wallet</span>
            </div>
            <div
              onClick={() => setCurrentScreen("profile")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                currentScreen === "profile" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Your Profile</span>
            </div>
            <div
              onClick={() => setCurrentScreen("transactionLimits")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                currentScreen === "transactionLimits" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Transaction Limits</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Shield className="w-5 h-5" />
              <span>KYC and Security</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(false)}
              className={!isDarkMode ? "bg-gray-100 text-gray-900" : "text-gray-600"}
            >
              <Sun className="w-4 h-4" />
              Light Mode
            </CustomButton>
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(true)}
              className={isDarkMode ? "bg-gray-100 text-gray-900" : "text-gray-600"}
            >
              <Moon className="w-4 h-4" />
              Dark Mode
            </CustomButton>
          </div>
        </div>

        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors ${
            isResizing ? "bg-blue-500" : "bg-transparent hover:bg-gray-300"
          }`}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Right Pane */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Page Header Section */}
        <div className="flex justify-center border-b border-gray-200 py-6">
          <div className="max-w-[640px] w-full text-center">
            <h1 className="font-semibold text-gray-900 text-xl">{getScreenTitle()}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 flex justify-center overflow-y-auto">
          {currentScreen === "wallet" && renderWalletScreen()}
          {currentScreen === "deposit" && renderDepositScreen()}
          {currentScreen === "withdraw" && renderWithdrawScreen()}
          {currentScreen === "profile" && renderProfileScreen()}
          {currentScreen === "transactionLimits" && renderTransactionLimitsScreen()}
        </div>
      </div>

      {showLimitsCurrencyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Select Currency</h3>
            <div className="space-y-2">
              {currencies.map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => {
                    setLimitsCurrency(currency)
                    setShowLimitsCurrencyDialog(false)
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">{currency.symbol}</span>
                  </div>
                  <div>
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-sm text-gray-600">{currency.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowLimitsCurrencyDialog(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
