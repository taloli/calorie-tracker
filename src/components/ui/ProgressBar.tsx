interface ProgressBarProps {
  value: number
  max: number
  color: string
  label: string
  unit?: string
}

export default function ProgressBar({ value, max, color, label, unit = 'ג׳' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const rounded = Math.round(value)
  const roundedMax = Math.round(max)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span className="font-medium">{label}</span>
        <span>
          {rounded}/{roundedMax} {unit}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
