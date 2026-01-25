import { cn } from '@/utils/cn'

interface Props {
  label: string
  isSelected: boolean
  onClick: () => void
  className?: string
}

const FilterTag: React.FC<Props> = ({
  label,
  isSelected,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-5 py-1 rounded-3xl text-sm font-bold transition-colors',
        isSelected
          ? 'bg-black text-white'
          : 'bg-white text-black border border-black',
        className,
      )}
    >
      {label}
    </button>
  )
}

export default FilterTag
