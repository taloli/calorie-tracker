import { useState } from 'react'
import type { Meal, MealType } from '@/types'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/types'
import MealItemRow from './MealItemRow'
import { useMealsStore } from '@/store/mealsStore'
import { useAuthStore } from '@/store/authStore'

interface MealSectionProps {
  mealType: MealType
  meal: Meal | null
  onAddFood: (mealType: MealType) => void
}

export default function MealSection({ mealType, meal, onAddFood }: MealSectionProps) {
  const [expanded, setExpanded] = useState(true)
  const deleteMealItem = useMealsStore((s) => s.deleteMealItem)
  const userId = useAuthStore((s) => s.session?.user.id ?? '')

  const items = meal?.meal_items ?? []
  const totalCals = items.reduce((s, i) => s + i.calories_total, 0)
  const hasItems = items.length > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{MEAL_TYPE_ICONS[mealType]}</span>
          <span className="font-semibold text-gray-800 text-sm">{MEAL_TYPE_LABELS[mealType]}</span>
          {hasItems && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasItems && (
            <span className="text-sm font-semibold text-brand-600">
              {Math.round(totalCals)} קק"ל
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Items */}
      {expanded && (
        <div className="px-4 pb-3">
          {hasItems && (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <MealItemRow
                  key={item.id}
                  item={item}
                  onDelete={(id) => deleteMealItem(id, meal!.id)}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => onAddFood(mealType)}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            הוסף מזון
          </button>
        </div>
      )}
    </div>
  )
}

void userId // suppress warning - used indirectly via store
