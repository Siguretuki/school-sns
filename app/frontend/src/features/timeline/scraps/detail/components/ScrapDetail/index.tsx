import { Link } from '@tanstack/react-router'
import { MoreHorizontal } from 'lucide-react'
import type { Owner } from '@/features/timeline/types'
import Avatar from '@/components/ui/Avatar'
import EditButton from '@/features/timeline/components/EditButton'
import MarkdownViewer from '@/features/timeline/components/MarkdownViewer'

interface Props {
  owner: Owner
  scrap: {
    id: string
    title: string
    body: string
    createdAt: string
    updatedAt: string
  }
  isEditable: boolean
}

const ScrapDetail: React.FC<Props> = ({ owner, scrap, isEditable }) => {
  return (
    <div className="flex flex-col px-4 pt-4 pb-2 bg-white rounded-t-xl border-b border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <Link
            to="/profile/$id/$userName"
            params={{ id: owner.id, userName: owner.name }}
          >
            <Avatar
              src={owner.avatarUrl ?? undefined}
              alt={owner.name}
              className="w-10 h-10"
            />
          </Link>
          <div className="flex flex-col leading-tight">
            <Link
              to="/profile/$id/$userName"
              params={{ id: owner.id, userName: owner.name }}
              className="font-bold text-slate-900 hover:underline"
            >
              {owner.name}
            </Link>
            <span className="text-slate-500 text-sm">@{owner.name}</span>
          </div>
        </div>
        <div className="relative">
          {isEditable ? (
            <Link to="/timeline/scraps/edit/$id" params={{ id: scrap.id }}>
              <EditButton />
            </Link>
          ) : (
            <button className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
              <MoreHorizontal />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {/* Title as part of content flow, emphasized */}
        <h1 className="text-xl font-bold mb-3 text-slate-900">{scrap.title}</h1>
        <MarkdownViewer
          mdSource={scrap.body}
          className="text-lg text-slate-800 whitespace-pre-wrap wrap-break-words leading-relaxed"
        />
      </div>

      {/* Timestamp */}
      <div className="text-slate-500 text-[15px] py-3 border-b border-slate-100">
        {new Date(scrap.createdAt)
          .toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          .replace(',', ' ·')}
      </div>
    </div>
  )
}

export default ScrapDetail
