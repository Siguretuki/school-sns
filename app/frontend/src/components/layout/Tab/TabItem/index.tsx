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
        'px-4 py-2 cursor-pointer select-none border border-t-0 border-x-slate-700 border-b-2 border-transparent text-nowrap',
        isActive
          ? 'border-b-blue-500 font-semibold text-black'
          : 'text-slate-600 hover:text-slate-800 hover:border-slate-300 bg-slate-300/10',
        className,
      )}
    >
      {label}
    </div>
  )
}

export default TabItem
