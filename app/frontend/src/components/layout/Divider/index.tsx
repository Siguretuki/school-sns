import { cn } from '@/utils/cn'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const Divider: React.FC<Props> = ({
  orientation = 'horizontal',
  className,
}) => {
  return (
    <div
      className={cn(
        orientation === 'vertical'
          ? 'w-px self-stretch bg-slate-200'
          : 'h-px w-full bg-slate-200',
        className,
      )}
      aria-hidden="true"
    />
  )
}

export default Divider
