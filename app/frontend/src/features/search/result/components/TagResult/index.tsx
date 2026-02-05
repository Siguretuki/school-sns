import { Hash } from 'lucide-react'

interface Props {
  tags: Array<{
    id: string
    name: string
  }>
}

const TagResult: React.FC<Props> = ({ tags }) => {
  return (
    <div className="flex flex-col gap-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-1 px-2 text-slate-800"
        >
          <Hash className="w-4 h-4" />
          <span className="text-md font-medium">{tag.name}</span>
        </div>
      ))}
    </div>
  )
}

export default TagResult
