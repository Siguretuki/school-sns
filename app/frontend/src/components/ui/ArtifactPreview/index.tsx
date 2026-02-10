import { Image as ImageIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Owner } from '@/features/timeline/types'
import type React from 'react'
import { formatDistanceToNowJa } from '@/utils/date'
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
      className="group flex flex-row bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Thumbnail (Left) */}
      <div className="w-32 sm:w-48 bg-slate-100 flex items-center justify-center shrink-0">
        {/* 画像を表示する */}
        {/* <ImageIcon className="text-slate-300 w-10 h-10" /> */}
        <img
          src={`https://picsum.photos/seed/${artifact.id}/400/400`}
          alt={artifact.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content (Right) */}
      <div className="flex flex-col p-4 w-full gap-2">
        {/* Header: Badge & User/Time */}

        {/* Title & Summary */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {artifact.title}
          </h3>
          {artifact.summaryByAI && (
            <p className="text-slate-600 text-sm line-clamp-2">
              {artifact.summaryByAI}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-2">
            <Avatar
              src={owner.avatarUrl ?? undefined}
              alt={owner.name}
              className="w-6 h-6"
            />
            <span className="text-xs text-slate-700 font-medium">
              {owner.name}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-500 text-xs whitespace-nowrap shrink-0">
              {artifact.publishedAt
                ? formatDistanceToNowJa(new Date(artifact.publishedAt))
                : '未公開'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ArtifactPreview
