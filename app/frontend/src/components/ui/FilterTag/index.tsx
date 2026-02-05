import { cn } from '@/utils/cn'

interface Props {
  label: string
  isSelected: boolean
  onClick: () => void
  icon?: React.ReactNode
  className?: string
}

const FilterTag: React.FC<Props> = ({
  label,
  isSelected,
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-5 py-1 rounded-3xl text-sm font-bold transition-colors flex items-center gap-1.5',
        isSelected
          ? 'bg-black text-white'
          : 'bg-white text-black border border-black',
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default FilterTag
