import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface Props {
  label: string
  isSelected: boolean
  icon?: ReactNode
  className?: string
}

const Tag: React.FC<Props> = ({ label, isSelected, icon, className }) => {
  return (
    <div
      className={cn(
        'px-5 py-1 rounded-3xl text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer select-none text-nowrap',
        isSelected
          ? 'bg-black text-white'
          : 'bg-white text-black border border-black hover:bg-slate-50',
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}

export default Tag
