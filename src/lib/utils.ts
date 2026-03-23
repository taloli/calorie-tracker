export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function todayString(): string {
  return formatDate(new Date())
}

export function roundOne(n: number): number {
  return Math.round(n * 10) / 10
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export const HEBREW_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

export function hebrewDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return HEBREW_DAYS[d.getDay()]
}

export function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(formatDate(d))
  }
  return days
}
