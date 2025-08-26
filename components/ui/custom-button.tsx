import React from "react"
import { Button as ShadcnButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = "primary", size = "md", fullWidth = false, className, children, ...props }, ref) => {
    const baseStyles =
      "font-semibold transition-all duration-200 ease-in-out flex items-center justify-center gap-2 border-0"

    const variants = {
      primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-sm",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
      outline: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg min-h-9",
      md: "px-6 py-3 text-base rounded-xl min-h-11",
      lg: "px-6 py-4 text-lg rounded-xl min-h-14",
      xl: "px-8 py-5 text-xl rounded-xl min-h-16",
    }

    const widthClass = fullWidth ? "w-full" : ""

    return (
      <ShadcnButton
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], widthClass, className)}
        {...props}
      >
        {children}
      </ShadcnButton>
    )
  },
)

CustomButton.displayName = "CustomButton"
