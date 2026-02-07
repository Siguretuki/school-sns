import { Hash } from 'lucide-react'

interface Props {
  id: string
  label: string
}

const TagPreview: React.FC<Props> = ({ id: _, label }) => {
  return (
    <div className="flex items-center gap-1 px-2 text-slate-800">
      <Hash className="w-4 h-4" />
      <span className="text-md font-medium">{label}</span>
    </div>
  )
}

export default TagPreview
