"use client"
import { CustomButton } from "@/components/ui/custom-button"
import { CheckCircle } from "lucide-react"
import BankDetailsCard from "@/components/shared/BankDetailsCard"

interface BankDetails {
  bankName: string
  beneficiaryName: string
  iban: string
  bankAddress: string
  bankCountry: string
  walletAddress: string
}

interface WithdrawalSuccessScreenProps {
  amount: string
  currency: {
    code: string
    name: string
    flag: string
  }
  bankDetails: BankDetails
  onDone: () => void
}

export default function WithdrawalSuccessScreen({
  amount,
  currency,
  bankDetails,
  onDone,
}: WithdrawalSuccessScreenProps) {
  return (
    <div className="py-8 space-y-8">
      <div className="text-center border-gray-200 border rounded-xl py-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        {/* Green Check */}
        <div className="w-16 h-16 mx-auto mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fiat Withdrawn</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Successfully withdrawn{" "}
          <span className="font-semibold text-green-600 dark:text-green-400">
            {amount} {currency.code}
          </span>{" "}
          to your selected bank account
        </p>
      </div>

      <BankDetailsCard bankDetails={bankDetails} showCopyButtons={true} />

      <CustomButton variant="primary" size="lg" fullWidth onClick={onDone} className="text-base">
        Done
      </CustomButton>
    </div>
  )
}
