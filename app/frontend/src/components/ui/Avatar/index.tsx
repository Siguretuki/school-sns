import { CircleUserRound } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props {
  src?: string
  alt?: string
  className?: string
}

const Avatar: React.FC<Props> = ({ src, alt = 'Avater', className }) => {
  return src !== undefined ? (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', className)}
    />
  ) : (
    <CircleUserRound className={cn('text-slate-300', className)} />
  )
}

export default Avatar
