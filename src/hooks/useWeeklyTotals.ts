import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { DailyTotal } from '@/types'
import { getLast7Days } from '@/lib/utils'

export function useWeeklyTotals(userId: string | undefined) {
  const [data, setData] = useState<DailyTotal[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    const days = getLast7Days()
    const fromDate = days[0]

    setIsLoading(true)
    supabase
      .from('daily_totals')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_date', fromDate)
      .order('logged_date', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setData(data as DailyTotal[])
        setIsLoading(false)
      })
  }, [userId])

  const refetch = async () => {
    if (!userId) return
    const days = getLast7Days()
    const fromDate = days[0]
    const { data, error } = await supabase
      .from('daily_totals')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_date', fromDate)
      .order('logged_date', { ascending: true })
    if (!error && data) setData(data as DailyTotal[])
  }

  return { data, isLoading, refetch }
}
