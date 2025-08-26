import { Loader2, X, AlertTriangle, ArrowUp, ArrowDown } from "your-icon-library"
import { baseClasses } from "your-styles-module"

const StatusIndicator = ({ status, transactionType }) => {
  switch (status) {
    case "loading":
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
      return null
  }
}

export default StatusIndicator
