import ProgressRing from '@/components/ui/ProgressRing'

interface CalorieRingProps {
  consumed: number
  goal: number
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const remaining = Math.max(goal - consumed, 0)
  const over = consumed > goal

  return (
    <div className="flex flex-col items-center gap-3">
      <ProgressRing value={consumed} max={goal} size={200} strokeWidth={16}>
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">{Math.round(consumed)}</p>
          <p className="text-xs text-gray-400 mt-0.5">קק"ל</p>
          <p className="text-xs text-gray-500 mt-1">
            {over
              ? `+${Math.round(consumed - goal)} מעל היעד`
              : `נותרו ${Math.round(remaining)}`}
          </p>
        </div>
      </ProgressRing>
      <div className="flex gap-6 text-center">
        <div>
          <p className="text-sm font-semibold text-gray-800">{Math.round(consumed)}</p>
          <p className="text-xs text-gray-400">נאכל</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div>
          <p className="text-sm font-semibold text-gray-800">{goal}</p>
          <p className="text-xs text-gray-400">יעד</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div>
          <p className={`text-sm font-semibold ${over ? 'text-red-500' : 'text-gray-800'}`}>
            {Math.round(remaining)}
          </p>
          <p className="text-xs text-gray-400">נותר</p>
        </div>
      </div>
    </div>
  )
}
