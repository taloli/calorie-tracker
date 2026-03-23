export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'ארוחת בוקר',
  lunch: 'ארוחת צהריים',
  dinner: 'ארוחת ערב',
  snack: 'חטיף',
}

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export interface Profile {
  id: string
  display_name: string | null
  calorie_goal: number
  protein_goal_g: number
  carbs_goal_g: number
  fat_goal_g: number
  created_at?: string
  updated_at?: string
}

export interface MealItem {
  id: string
  meal_id: string
  food_name: string
  open_food_facts_id: string | null
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  quantity_grams: number
  calories_total: number
  protein_total: number
  carbs_total: number
  fat_total: number
  created_at?: string
}

export interface Meal {
  id: string
  user_id: string
  meal_type: MealType
  logged_date: string
  created_at?: string
  meal_items: MealItem[]
}

export interface DailyTotal {
  user_id: string
  logged_date: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
}

export interface OFFProduct {
  id: string
  name: string
  brand: string | null
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  image_url: string | null
}

export interface DayMacros {
  calories: number
  protein: number
  carbs: number
  fat: number
}
