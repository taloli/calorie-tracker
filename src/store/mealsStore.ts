import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Meal, MealType, OFFProduct } from '@/types'
import { todayString } from '@/lib/utils'

interface MealsState {
  meals: Meal[]
  isLoading: boolean
  activeDate: string
  setActiveDate: (date: string) => void
  fetchMealsForDate: (date: string, userId: string) => Promise<void>
  addMealItem: (payload: {
    product: OFFProduct
    quantityGrams: number
    mealType: MealType
    date: string
    userId: string
  }) => Promise<void>
  deleteMealItem: (itemId: string, mealId: string) => Promise<void>
}

export const useMealsStore = create<MealsState>((set, get) => ({
  meals: [],
  isLoading: false,
  activeDate: todayString(),

  setActiveDate: (date) => set({ activeDate: date }),

  fetchMealsForDate: async (date, userId) => {
    set({ isLoading: true })
    const { data, error } = await supabase
      .from('meals')
      .select('*, meal_items(*)')
      .eq('user_id', userId)
      .eq('logged_date', date)
      .order('created_at', { ascending: true })
    if (!error) set({ meals: (data ?? []) as Meal[] })
    set({ isLoading: false })
  },

  addMealItem: async ({ product, quantityGrams, mealType, date, userId }) => {
    // Find existing meal of this type for this date, or create one
    let mealId: string | null = null

    const { data: existingMeal } = await supabase
      .from('meals')
      .select('id')
      .eq('user_id', userId)
      .eq('meal_type', mealType)
      .eq('logged_date', date)
      .single()

    if (existingMeal) {
      mealId = existingMeal.id
    } else {
      const { data: newMeal, error } = await supabase
        .from('meals')
        .insert({ user_id: userId, meal_type: mealType, logged_date: date })
        .select()
        .single()
      if (error) throw error
      mealId = newMeal.id
    }

    const { error: itemError } = await supabase.from('meal_items').insert({
      meal_id: mealId,
      food_name: product.name,
      open_food_facts_id: product.id || null,
      calories_per_100g: product.calories_per_100g,
      protein_per_100g: product.protein_per_100g,
      carbs_per_100g: product.carbs_per_100g,
      fat_per_100g: product.fat_per_100g,
      quantity_grams: quantityGrams,
    })
    if (itemError) throw itemError

    // Refresh meals
    const { session } = await supabase.auth.getSession()
    if (session.session) {
      await get().fetchMealsForDate(date, userId)
    }
  },

  deleteMealItem: async (itemId, _mealId) => {
    // Optimistic update
    set((state) => ({
      meals: state.meals.map((m) => ({
        ...m,
        meal_items: m.meal_items.filter((i) => i.id !== itemId),
      })),
    }))

    const { error } = await supabase.from('meal_items').delete().eq('id', itemId)
    if (error) {
      // Rollback not implemented for simplicity - just refetch
      console.error('Delete failed:', error)
    }
  },
}))
