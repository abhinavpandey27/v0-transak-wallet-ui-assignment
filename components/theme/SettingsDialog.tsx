"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Settings } from "lucide-react"
import { ThemeSettings } from "./ThemeSettings"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-0 pb-4 pt-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[color-mix(in_oklab,var(--brand)_20%,white)] dark:bg-[color-mix(in_oklab,var(--brand)_20%,black)] flex items-center justify-center">
              <Settings className="w-5 h-5" style={{ color: "var(--brand)" }} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Theme Settings</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 px-0 py-0">
          <ThemeSettings />
        </div>
      </DialogContent>
    </Dialog>
  )
}
