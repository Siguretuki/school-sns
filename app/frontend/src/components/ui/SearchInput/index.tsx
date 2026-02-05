import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  className?: string
  containerClassName?: string
}

const SearchInput: React.FC<Props> = ({
  value,
  onChange,
  onClear,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center bg-slate-100 rounded-full px-4 py-2.5 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-black/5',
        containerClassName,
      )}
    >
      <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-base',
          className,
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="ml-2 p-1 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

export default SearchInput
