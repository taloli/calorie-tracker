import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useMealsStore } from '@/store/mealsStore'
import CalorieRing from '@/components/dashboard/CalorieRing'
import MacroBars from '@/components/dashboard/MacroBars'
import MealSection from '@/components/dashboard/MealSection'
import Spinner from '@/components/ui/Spinner'
import { MEAL_TYPES, type MealType } from '@/types'
import { todayString } from '@/lib/utils'

export default function DashboardPage() {
  const { profile, session } = useAuthStore()
  const { meals, isLoading, fetchMealsForDate } = useMealsStore()
  const navigate = useNavigate()

  const today = todayString()
  const userId = session?.user.id ?? ''

  useEffect(() => {
    if (userId) fetchMealsForDate(today, userId)
  }, [userId, today, fetchMealsForDate])

  const allItems = meals.flatMap((m) => m.meal_items)
  const totals = {
    calories: allItems.reduce((s, i) => s + i.calories_total, 0),
    protein: allItems.reduce((s, i) => s + i.protein_total, 0),
    carbs: allItems.reduce((s, i) => s + i.carbs_total, 0),
    fat: allItems.reduce((s, i) => s + i.fat_total, 0),
  }

  const getMealByType = (type: MealType) =>
    meals.find((m) => m.meal_type === type) ?? null

  const handleAddFood = (mealType: MealType) => {
    navigate(`/log?meal=${mealType}`)
  }

  const dateLabel = new Date(today + 'T12:00:00').toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="px-4 pt-6 pb-4 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">שלום 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5 capitalize">{dateLabel}</p>
      </div>

      {/* Calorie Ring */}
      <div className="bg-white rounded-2xl shadow-sm p-5 flex justify-center">
        <CalorieRing
          consumed={totals.calories}
          goal={profile?.calorie_goal ?? 2000}
        />
      </div>

      {/* Macros */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">מאקרו-נוטריינטים</h2>
        <MacroBars
          protein={{ consumed: totals.protein, goal: profile?.protein_goal_g ?? 150 }}
          carbs={{ consumed: totals.carbs, goal: profile?.carbs_goal_g ?? 250 }}
          fat={{ consumed: totals.fat, goal: profile?.fat_goal_g ?? 65 }}
        />
      </div>

      {/* Meals */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-500">ארוחות היום</h2>
          {MEAL_TYPES.map((type) => (
            <MealSection
              key={type}
              mealType={type}
              meal={getMealByType(type)}
              onAddFood={handleAddFood}
            />
          ))}
        </div>
      )}
    </div>
  )
}
