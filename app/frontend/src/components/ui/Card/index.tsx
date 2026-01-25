import { cn } from '@/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={cn('rounded-xl shadow-lg p-4', className)}>{children}</div>
  )
}

export default Card
