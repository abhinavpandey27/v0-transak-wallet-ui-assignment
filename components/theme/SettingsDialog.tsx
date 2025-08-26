"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Settings, Type, Maximize2, Palette, Monitor, Code, Eye } from "lucide-react"
import { TypographySettings } from "./TypographySettings"
import { ScalingSettings } from "./ScalingSettings"
import { ThemeSettings } from "./ThemeSettings"
import { BrandSettings } from "./BrandSettings"
import { ComponentMigrationGuide } from "./ComponentMigrationGuide"
import { ContrastPreview } from "./ContrastPreview"
import { useCustomTheme } from "@/contexts/ThemeContext"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("appearance")
  const { resetToDefaults } = useCustomTheme()

  const tabs = [
    {
      id: "appearance",
      label: "Appearance",
      icon: <Monitor className="w-4 h-4" />,
      component: <ThemeSettings />,
    },
    {
      id: "typography",
      label: "Typography",
      icon: <Type className="w-4 h-4" />,
      component: <TypographySettings />,
    },
    {
      id: "scaling",
      label: "Scaling",
      icon: <Maximize2 className="w-4 h-4" />,
      component: <ScalingSettings />,
    },
    {
      id: "brand",
      label: "Brand Colors",
      icon: <Palette className="w-4 h-4" />,
      component: <BrandSettings />,
    },
    {
      id: "accessibility",
      label: "Accessibility",
      icon: <Eye className="w-4 h-4" />,
      component: <ContrastPreview />,
    },
    {
      id: "guide",
      label: "Developer Guide",
      icon: <Code className="w-4 h-4" />,
      component: <ComponentMigrationGuide />,
    },
  ]

  const handleResetAll = () => {
    if (confirm("Are you sure you want to reset all customization settings to defaults?")) {
      resetToDefaults()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div className={`flex-shrink-0 ${activeTab === tab.id ? "text-blue-600 dark:text-blue-400" : ""}`}>
                      {tab.icon}
                    </div>
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={handleResetAll}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Reset All Settings
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Content Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="text-blue-600 dark:text-blue-400">{tabs.find((tab) => tab.id === activeTab)?.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
              <div className="p-6 max-w-4xl">{tabs.find((tab) => tab.id === activeTab)?.component}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
