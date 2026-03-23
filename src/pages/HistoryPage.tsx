import { useAuthStore } from '@/store/authStore'
import { useWeeklyTotals } from '@/hooks/useWeeklyTotals'
import WeeklyBarChart from '@/components/history/WeeklyBarChart'
import Spinner from '@/components/ui/Spinner'
import { getLast7Days, todayString } from '@/lib/utils'

export default function HistoryPage() {
  const { session, profile } = useAuthStore()
  const { data, isLoading } = useWeeklyTotals(session?.user.id)
  const calorieGoal = profile?.calorie_goal ?? 2000
  const today = todayString()
  const last7 = getLast7Days()

  const totalWeek = data.reduce((s, d) => s + d.total_calories, 0)
  const avgDay = data.length > 0 ? totalWeek / data.length : 0

  return (
    <div className="px-4 pt-6 pb-4 flex flex-col gap-5">
      <h1 className="text-xl font-bold text-gray-900">היסטוריה</h1>

      {/* Weekly summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-400">ממוצע יומי (7 ימים)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{Math.round(avgDay)}</p>
          <p className="text-xs text-gray-400">קק"ל</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs text-gray-400">סה"כ השבוע</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{Math.round(totalWeek)}</p>
          <p className="text-xs text-gray-400">קק"ל</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">7 הימים האחרונים</h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <WeeklyBarChart data={data} calorieGoal={calorieGoal} />
        )}
      </div>

      {/* Day list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">פירוט ימים</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[...last7].reverse().map((date) => {
            const dayData = data.find((d) => d.logged_date === date)
            const cals = Math.round(dayData?.total_calories ?? 0)
            const isToday = date === today
            const pct = calorieGoal > 0 ? Math.min((cals / calorieGoal) * 100, 100) : 0
            const d = new Date(date + 'T12:00:00')
            const label = d.toLocaleDateString('he-IL', {
              weekday: 'long', day: 'numeric', month: 'short',
            })

            return (
              <div key={date} className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{label}</span>
                    {isToday && (
                      <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                        היום
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${cals > calorieGoal ? 'text-red-500' : 'text-gray-800'}`}>
                    {cals > 0 ? `${cals} קק"ל` : '—'}
                  </span>
                </div>
                {cals > 0 && (
                  <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cals > calorieGoal ? 'bg-red-400' : 'bg-brand-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
