import ProgressBar from '@/components/ui/ProgressBar'

interface MacroBarsProps {
  protein: { consumed: number; goal: number }
  carbs: { consumed: number; goal: number }
  fat: { consumed: number; goal: number }
}

export default function MacroBars({ protein, carbs, fat }: MacroBarsProps) {
  return (
    <div className="flex flex-col gap-3">
      <ProgressBar
        label="חלבון"
        value={protein.consumed}
        max={protein.goal}
        color="bg-blue-500"
      />
      <ProgressBar
        label="פחמימות"
        value={carbs.consumed}
        max={carbs.goal}
        color="bg-orange-400"
      />
      <ProgressBar
        label="שומן"
        value={fat.consumed}
        max={fat.goal}
        color="bg-yellow-400"
      />
    </div>
  )
}
