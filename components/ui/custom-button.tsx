import React from "react"
import { Button as ShadcnButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "brand"
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
      primary:
        "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800",
      secondary:
        "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:text-white",
      outline:
        "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600",
      ghost:
        "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:active:bg-gray-600",
      brand:
        "bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-brand-primary-foreground shadow-sm transition-colors",
    }

    const sizes = {
      sm: "px-4 py-2 text-scaled-sm rounded-lg min-h-9",
      md: "px-scaled-6 py-scaled-3 text-scaled-base rounded-xl min-h-11",
      lg: "px-scaled-6 py-scaled-4 text-scaled-lg rounded-xl min-h-14",
      xl: "px-scaled-8 py-5 text-scaled-xl rounded-xl min-h-16",
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
