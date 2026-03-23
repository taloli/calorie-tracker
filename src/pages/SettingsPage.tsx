import { useState, FormEvent } from 'react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SettingsPage() {
  const { profile, updateProfile, signOut } = useAuthStore()
  const [calorieGoal, setCalorieGoal] = useState(String(profile?.calorie_goal ?? 2000))
  const [proteinGoal, setProteinGoal] = useState(String(profile?.protein_goal_g ?? 150))
  const [carbsGoal, setCarbsGoal] = useState(String(profile?.carbs_goal_g ?? 250))
  const [fatGoal, setFatGoal] = useState(String(profile?.fat_goal_g ?? 65))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        calorie_goal: parseInt(calorieGoal) || 2000,
        protein_goal_g: parseInt(proteinGoal) || 150,
        carbs_goal_g: parseInt(carbsGoal) || 250,
        fat_goal_g: parseInt(fatGoal) || 65,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-4 flex flex-col gap-5">
      <h1 className="text-xl font-bold text-gray-900">הגדרות</h1>

      {/* Goals form */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">יעדים יומיים</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label='יעד קלוריות (קק"ל)'
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            min="500" max="9999"
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="חלבון (ג׳)"
              type="number"
              value={proteinGoal}
              onChange={(e) => setProteinGoal(e.target.value)}
              min="0"
            />
            <Input
              label="פחמימות (ג׳)"
              type="number"
              value={carbsGoal}
              onChange={(e) => setCarbsGoal(e.target.value)}
              min="0"
            />
            <Input
              label="שומן (ג׳)"
              type="number"
              value={fatGoal}
              onChange={(e) => setFatGoal(e.target.value)}
              min="0"
            />
          </div>
          <Button type="submit" size="lg" isLoading={saving}>
            {saved ? '✅ נשמר!' : 'שמור שינויים'}
          </Button>
        </form>
      </div>

      {/* Info */}
      <div className="bg-brand-50 rounded-2xl p-4 text-sm text-brand-700">
        <p className="font-semibold mb-1">💡 טיפ</p>
        <p className="text-xs text-brand-600">
          יעד קלוריות מומלץ לגברים: 2000–2500 קק"ל, לנשים: 1600–2000 קק"ל.
          התייעץ עם תזונאי לייעוץ מותאם אישית.
        </p>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-3">חשבון</h2>
        <p className="text-sm text-gray-500 mb-4">מחובר כ: <strong>{useAuthStore.getState().session?.user.email}</strong></p>
        <Button
          variant="danger"
          size="lg"
          onClick={() => signOut()}
        >
          התנתק
        </Button>
      </div>
    </div>
  )
}
