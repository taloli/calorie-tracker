import type { MealType } from '@/types'
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS, MEAL_TYPES } from '@/types'

interface MealTypePickerProps {
  value: MealType
  onChange: (v: MealType) => void
}

export default function MealTypePicker({ value, onChange }: MealTypePickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {MEAL_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all
            ${value === type
              ? 'bg-brand-500 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <span className="text-lg">{MEAL_TYPE_ICONS[type]}</span>
          <span className="text-center leading-tight">
            {MEAL_TYPE_LABELS[type].replace('ארוחת ', '')}
          </span>
        </button>
      ))}
    </div>
  )
}
