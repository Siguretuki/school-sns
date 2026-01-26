import { Eye, EyeOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type React from 'react'
import { cn } from '@/utils/cn'

interface Props {
  type: React.HTMLInputTypeAttribute
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  icon: LucideIcon
  className?: string
  showPasswordToggle?: boolean
  isPasswordVisible?: boolean
  onTogglePasswordVisibility?: () => void
}

const InputWithIcon: React.FC<Props> = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  className,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
}) => {
  const inputType = showPasswordToggle
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : type

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon className="h-5 w-5" />
      </span>
      <input
        type={inputType}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-700/30 focus:border-transparent transition-colors',
          showPasswordToggle ? 'pr-11' : 'pr-4',
          className,
        )}
        placeholder={placeholder}
      />
      {showPasswordToggle && (
        <button
          type="button"
          aria-label={
            isPasswordVisible ? 'パスワードを隠す' : 'パスワードを表示'
          }
          onClick={onTogglePasswordVisibility ?? (() => {})}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          {isPasswordVisible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  )
}

export default InputWithIcon
