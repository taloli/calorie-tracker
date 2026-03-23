import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFoodSearch } from '@/hooks/useFoodSearch'
import { useAuthStore } from '@/store/authStore'
import { useMealsStore } from '@/store/mealsStore'
import FoodResultCard from '@/components/log/FoodResultCard'
import AddFoodModal from '@/components/log/AddFoodModal'
import Spinner from '@/components/ui/Spinner'
import type { OFFProduct, MealType } from '@/types'
import { todayString } from '@/lib/utils'

const QUICK_SEARCHES = ['תפוח', 'עוף', 'אורז', 'לחם', 'ביצה', 'קוטג׳', 'בננה', 'שוקולד']

export default function LogMealPage() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<OFFProduct | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialMeal = (searchParams.get('meal') as MealType) || 'breakfast'
  const { results, isLoading, error } = useFoodSearch(query)
  const { session } = useAuthStore()
  const { addMealItem } = useMealsStore()

  const handleConfirm = async ({
    product,
    quantityGrams,
    mealType,
  }: {
    product: OFFProduct
    quantityGrams: number
    mealType: MealType
  }) => {
    if (!session) return
    await addMealItem({
      product,
      quantityGrams,
      mealType,
      date: todayString(),
      userId: session.user.id,
    })
    setSelected(null)
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">חיפוש מזון</h1>
        </div>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש מזון... (עברית או אנגלית)"
            autoFocus
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pe-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          {isLoading ? (
            <div className="absolute start-3 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          ) : (
            <svg
              className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Quick searches */}
        {!query && (
          <div className="px-4 py-4">
            <p className="text-xs font-medium text-gray-400 mb-3">חיפושים מהירים</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600 hover:bg-brand-100 hover:text-brand-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-4 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* No results */}
        {query && !isLoading && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <span className="text-4xl mb-3">🔍</span>
            <p className="font-medium text-gray-700">לא נמצאו תוצאות</p>
            <p className="text-sm text-gray-400 mt-1">נסה לחפש באנגלית</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="divide-y divide-gray-50">
            {results.map((product) => (
              <FoodResultCard
                key={product.id}
                product={product}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add food modal */}
      <AddFoodModal
        product={selected}
        initialMealType={initialMeal}
        onClose={() => setSelected(null)}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
