import type { LucideIcon } from 'lucide-react'
import type React from 'react'

interface Props {
  type: React.HTMLInputTypeAttribute
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  icon: LucideIcon
  className?: string
}

const InputWithIcon: React.FC<Props> = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="peer border border-gray-300 rounded-md px-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder=" "
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex gap-1 peer-[:not(:placeholder-shown)]:hidden">
        <Icon />
        {placeholder ?? <span>{placeholder}</span>}
      </span>
    </div>
  )
}

export default InputWithIcon
