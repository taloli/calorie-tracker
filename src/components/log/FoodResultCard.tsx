import type { OFFProduct } from '@/types'

interface FoodResultCardProps {
  product: OFFProduct
  onSelect: (p: OFFProduct) => void
}

export default function FoodResultCard({ product, onSelect }: FoodResultCardProps) {
  return (
    <button
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-start"
      onClick={() => onSelect(product)}
    >
      {/* Image or emoji placeholder */}
      <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-2xl">🍽️</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
        {product.brand && (
          <p className="text-xs text-gray-400 truncate">{product.brand}</p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          {Math.round(product.calories_per_100g)} קק"ל / 100ג׳
        </p>
      </div>

      <div className="shrink-0 text-end">
        <div className="text-xs text-gray-400 space-y-0.5">
          <p>ח: {Math.round(product.protein_per_100g)}ג׳</p>
          <p>פ: {Math.round(product.carbs_per_100g)}ג׳</p>
          <p>ש: {Math.round(product.fat_per_100g)}ג׳</p>
        </div>
      </div>
    </button>
  )
}
