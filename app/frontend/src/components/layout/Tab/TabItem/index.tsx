import { cn } from '@/utils/cn'

interface Props {
  label: string
  isActive: boolean
  className?: string
}

const TabItem: React.FC<Props> = ({ label, isActive, className }) => {
  return (
    <div
      className={cn(
        'flex-1 cursor-pointer select-none text-nowrap text-center text-sm font-semibold py-3 border-b-2 transition-colors',
        isActive
          ? 'text-sky-600 border-sky-500'
          : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-sky-200',
        className,
      )}
    >
      {label}
    </div>
  )
}

export default TabItem
