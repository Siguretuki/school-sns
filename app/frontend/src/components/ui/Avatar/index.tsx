import { cn } from '@/utils/cn'

interface Props {
  size?: number
  src?: string
  alt?: string
  className?: string
}

const Avatar: React.FC<Props> = ({
  size = 10,
  src = '/tanstack-circle-logo.png',
  alt = 'Avater',
  className,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'rounded-full object-cover',
        `w-${size} h-${size}`,
        className,
      )}
    />
  )
}

export default Avatar
