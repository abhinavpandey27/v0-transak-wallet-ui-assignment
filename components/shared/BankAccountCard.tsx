"use client"

interface BankAccount {
  id: number
  bankName: string
  iban: string
  beneficiary: string
  address: string
}

interface BankAccountCardProps {
  account: BankAccount
  isSelected: boolean
  onSelect: () => void
}

export default function BankAccountCard({ account, isSelected, onSelect }: BankAccountCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
            isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
          }`}
        >
          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
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
  )
}
