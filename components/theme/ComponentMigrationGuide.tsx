"use client"

import { Card } from "@/components/ui/card"
import { Code, Info, CheckCircle } from "lucide-react"

export function ComponentMigrationGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Component Scaling Guide
        </h3>

        <div className="space-y-4">
          {/* Quick Start */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Quick Start</h4>
                <p className="text-sm text-gray-600 mb-3">Replace fixed Tailwind classes with scaled equivalents:</p>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  <div className="text-red-600">- className="text-lg p-4 m-2"</div>
                  <div className="text-green-600">+ className="text-scaled-lg p-scaled-4 space-scaled-2"</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Available Classes */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Available Scaled Classes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Typography:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <code>text-scaled-xs</code> - Extra small text
                  </li>
                  <li>
                    <code>text-scaled-sm</code> - Small text
                  </li>
                  <li>
                    <code>text-scaled-base</code> - Base text
                  </li>
                  <li>
                    <code>text-scaled-lg</code> - Large text
                  </li>
                  <li>
                    <code>text-scaled-xl</code> - Extra large text
                  </li>
                  <li>
                    <code>text-scaled-2xl</code> - 2x large text
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Spacing:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <code>p-scaled-1</code> - Scaled padding
                  </li>
                  <li>
                    <code>p-scaled-2</code> - Scaled padding
                  </li>
                  <li>
                    <code>p-scaled-4</code> - Scaled padding
                  </li>
                  <li>
                    <code>space-scaled-2</code> - Scaled margin
                  </li>
                  <li>
                    <code>space-scaled-4</code> - Scaled margin
                  </li>
                  <li>
                    <code>space-scaled-8</code> - Scaled margin
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Advanced Usage */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Advanced: CSS Custom Properties</h4>
            <p className="text-sm text-gray-600 mb-3">For custom components, use CSS custom properties directly:</p>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm space-y-2">
              <div>/* In your CSS or styled components */</div>
              <div>.my-component {`{`}</div>
              <div className="pl-4">font-size: var(--font-scale-lg);</div>
              <div className="pl-4">padding: var(--space-4);</div>
              <div className="pl-4">margin: var(--space-2);</div>
              <div>{`}`}</div>
            </div>
          </Card>

          {/* Migration Checklist */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Migration Checklist
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Replace text-* classes with text-scaled-*</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Replace p-* and m-* classes with scaled equivalents</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Update custom CSS to use CSS custom properties</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Test all scaling levels (compact, normal, comfortable, large)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Verify responsive behavior on different screen sizes</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
