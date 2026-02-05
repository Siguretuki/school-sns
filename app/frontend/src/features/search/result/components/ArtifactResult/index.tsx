import { Link } from '@tanstack/react-router'
import { Clock } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'

interface Props {
  artifacts: Array<{
    author: {
      userName: string
      avatarUrl: string | null
    }
    id: string
    title: string
    publishedAt: string | null
  }>
}

const ArtifactResult: React.FC<Props> = ({ artifacts }) => {
  return (
    <div className="flex flex-col gap-3">
      {artifacts.map((artifact) => (
        <Link
          key={artifact.id}
          to="/timeline/artifacts/detail/$id"
          params={{ id: artifact.id }}
          className="p-2 flex flex-col gap-1 border border-slate-300 rounded-md hover:bg-slate-100"
        >
          <div className="flex gap-2">
            <Avatar
              src={artifact.author.avatarUrl ?? undefined}
              alt={artifact.author.userName}
              size={6}
            />
            <span className="text-sm text-slate-700">
              {artifact.author.userName}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {artifact.title}
          </h3>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {new Date(artifact.publishedAt ?? '').toLocaleDateString()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ArtifactResult
