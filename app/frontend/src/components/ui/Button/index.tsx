import { cn } from '@/utils/cn'

interface Props {
  children: React.ReactNode
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  className?: string
  disabled?: boolean
}

const Button: React.FC<Props> = ({
  children,
  type = 'button',
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors',
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
