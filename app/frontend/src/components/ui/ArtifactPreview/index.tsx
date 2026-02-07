import { Clock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Owner } from '@/features/timeline/types'
import type React from 'react'
import Avatar from '@/components/ui/Avatar'

interface Props {
  owner: Owner
  artifact: {
    id: string
    title: string
    summaryByAI: string | null
    publishedAt: string | null
  }
}

const ArtifactPreview: React.FC<Props> = ({ owner, artifact }) => {
  return (
    <Link
      key={artifact.id}
      to="/timeline/artifacts/detail/$id"
      params={{ id: artifact.id }}
      className="p-2 flex flex-col gap-1 border border-slate-300 rounded-md hover:bg-slate-100"
    >
      <div className="flex gap-2">
        <Avatar src={owner.avatarUrl ?? undefined} alt={owner.name} size={6} />
        <span className="text-sm text-slate-700">{owner.name}</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{artifact.title}</h3>
      <div className="flex items-center gap-1 text-slate-500">
        <Clock className="w-4 h-4" />
        <span className="text-sm">
          {artifact.publishedAt
            ? new Date(artifact.publishedAt).toLocaleDateString()
            : '未公開'}
        </span>
      </div>
    </Link>
  )
}

export default ArtifactPreview
