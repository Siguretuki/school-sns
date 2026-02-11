import { Calendar } from 'lucide-react'

interface Props {
  publishedAt: string | null
}

const MetaInfo: React.FC<Props> = ({ publishedAt }) => {
  return (
    <div className="flex items-center gap-6 text-slate-500 text-sm border-b border-slate-100 py-4 w-full">
      <div className="flex items-center gap-2">
        <Calendar size={16} />
        <span>
          {publishedAt
            ? new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Draft'}
        </span>
      </div>
    </div>
  )
}

export default MetaInfo
