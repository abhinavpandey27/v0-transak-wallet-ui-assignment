import React from "react"
import { Button as ShadcnButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "brand"
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = "primary", size = "md", fullWidth = false, className, children, ...props }, ref) => {
    const buttonVariants = cva(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        variants: {
          variant: {
            default: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800",
            destructive: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800",
            outline: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600",
            secondary: "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:text-white",
            ghost: "hover:bg-gray-100 active:bg-gray-200 text-gray-600 hover:text-gray-900 dark:hover:bg-gray-700 dark:active:bg-gray-600 dark:text-gray-400 dark:hover:text-gray-200",
            link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
            primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700",
            brand: "bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white shadow-sm dark:bg-gray-100 dark:hover:bg-gray-200 dark:active:bg-gray-300 dark:text-gray-900",
          },
          size: {
            default: "h-10 px-4 py-2",
            sm: "px-4 py-2 text-sm rounded-lg min-h-9",
            md: "px-6 py-3 text-base rounded-xl min-h-11",
            lg: "px-6 py-4 text-lg rounded-xl min-h-14",
            xl: "px-8 py-5 text-xl rounded-xl min-h-16",
            icon: "h-10 w-10",
          },
          fullWidth: {
            true: "w-full",
            false: "",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
          fullWidth: false,
        },
      }
    )

    return (
      <ShadcnButton
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </ShadcnButton>
    )
  },
)

CustomButton.displayName = "CustomButton"
