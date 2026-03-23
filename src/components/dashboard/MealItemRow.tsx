import { useState } from 'react'
import type { MealItem } from '@/types'

interface MealItemRowProps {
  item: MealItem
  onDelete: (id: string) => void
}

export default function MealItemRow({ item, onDelete }: MealItemRowProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex items-center justify-between py-2.5 gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.food_name}</p>
        <p className="text-xs text-gray-400">{Math.round(item.quantity_grams)}ג׳</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <p className="text-sm font-semibold text-gray-700">
          {Math.round(item.calories_total)} קק"ל
        </p>
        {confirming ? (
          <div className="flex gap-1">
            <button
              onClick={() => onDelete(item.id)}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg"
            >
              מחק
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg"
            >
              ביטול
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
            aria-label="מחק"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
