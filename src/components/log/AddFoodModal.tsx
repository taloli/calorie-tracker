import { useState } from 'react'
import type { OFFProduct, MealType } from '@/types'
import BottomSheet from '@/components/ui/BottomSheet'
import MealTypePicker from './MealTypePicker'
import Button from '@/components/ui/Button'

interface AddFoodModalProps {
  product: OFFProduct | null
  initialMealType: MealType
  onClose: () => void
  onConfirm: (payload: {
    product: OFFProduct
    quantityGrams: number
    mealType: MealType
  }) => Promise<void>
}

export default function AddFoodModal({
  product,
  initialMealType,
  onClose,
  onConfirm,
}: AddFoodModalProps) {
  const [quantity, setQuantity] = useState('100')
  const [mealType, setMealType] = useState<MealType>(initialMealType)
  const [loading, setLoading] = useState(false)

  if (!product) return null

  const grams = parseFloat(quantity) || 0
  const calories = (product.calories_per_100g * grams) / 100
  const protein = (product.protein_per_100g * grams) / 100
  const carbs = (product.carbs_per_100g * grams) / 100
  const fat = (product.fat_per_100g * grams) / 100

  const handleConfirm = async () => {
    if (grams <= 0) return
    setLoading(true)
    try {
      await onConfirm({ product, quantityGrams: grams, mealType })
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheet isOpen={!!product} onClose={onClose} title="הוסף מזון">
      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Product name */}
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl">🍽️</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            {product.brand && <p className="text-xs text-gray-400">{product.brand}</p>}
          </div>
        </div>

        {/* Quantity input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">כמות (גרמים)</label>
          <div className="flex items-center gap-3">
            <button
              className="h-10 w-10 rounded-xl bg-gray-100 text-xl font-bold text-gray-600 hover:bg-gray-200 flex items-center justify-center"
              onClick={() => setQuantity(String(Math.max(10, grams - 10)))}
            >−</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 text-center rounded-xl border border-gray-200 py-2.5 text-lg font-bold focus:outline-none focus:border-brand-500"
              min="1"
              max="9999"
            />
            <button
              className="h-10 w-10 rounded-xl bg-gray-100 text-xl font-bold text-gray-600 hover:bg-gray-200 flex items-center justify-center"
              onClick={() => setQuantity(String(grams + 10))}
            >+</button>
          </div>
        </div>

        {/* Nutrition preview */}
        {grams > 0 && (
          <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'קק"ל', value: Math.round(calories), color: 'text-brand-600' },
              { label: 'חלבון', value: `${Math.round(protein)}ג׳`, color: 'text-blue-500' },
              { label: 'פחמימות', value: `${Math.round(carbs)}ג׳`, color: 'text-orange-400' },
              { label: 'שומן', value: `${Math.round(fat)}ג׳`, color: 'text-yellow-500' },
            ].map((m) => (
              <div key={m.label}>
                <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-gray-400">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Meal type picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ארוחה</label>
          <MealTypePicker value={mealType} onChange={setMealType} />
        </div>

        {/* Confirm */}
        <Button size="lg" onClick={handleConfirm} isLoading={loading} disabled={grams <= 0}>
          הוסף לארוחה
        </Button>
      </div>
    </BottomSheet>
  )
}
