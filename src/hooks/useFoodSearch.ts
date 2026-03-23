import { useState, useEffect, useRef } from 'react'
import { searchFoods } from '@/lib/openFoodFacts'
import type { OFFProduct } from '@/types'

export function useFoodSearch(query: string, debounceMs = 500) {
  const [results, setResults] = useState<OFFProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await searchFoods(query)
        setResults(data)
      } catch {
        setError('שגיאה בחיפוש. בדוק חיבור לאינטרנט ונסה שוב.')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, debounceMs])

  return { results, isLoading, error }
}
