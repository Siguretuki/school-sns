import { ClockFading, X } from 'lucide-react'

interface Props {
  keyword: string
  onDelete: () => void
}

const SearchHistory: React.FC<Props> = ({ keyword, onDelete }) => {
  return (
    <div className="flex justify-between items-center px-2 w-full">
      <div className="flex items-center gap-3">
        <ClockFading className="w-5 h-5 text-slate-500" />
        <span className="text-slate-800 text-lg">{keyword}</span>
      </div>
      <button
        className="text-sm text-red-500 hover:underline"
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDelete()
        }}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

export default SearchHistory
