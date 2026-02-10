import { Link } from '@tanstack/react-router'
import { Calendar, MoreHorizontal } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import MarkdownViewer from '@/features/timeline/components/MarkdownViewer'
import EditButton from '@/features/timeline/components/EditButton'
import AISummary from '@/features/timeline/artifacts/detail/components/AISummary'

interface Props {
  data: {
    id: string
    title: string
    body: string
    summaryByAI: string | null
    createdAt: string
    updatedAt: string
    publishedAt: string | null
    user: {
      id: string
      userName: string
      avatarUrl: string | null
    }
  }
  currentUserId?: string
}

const ArtifactDetail: React.FC<Props> = ({ data, currentUserId }) => {
  const isOwner = currentUserId === data.user.id

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 pb-10">
      {/* Hero Section - TODO: Implement when coverImage is available in API */}
      {/* <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-100">...</div> */}

      {/* Main Content */}
      <div className="flex flex-col px-6 md:px-10 mt-6 gap-6 max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            {data.title}
          </h1>

          {/* Action Buttons (Moved here since Hero is gone or until Hero returns) */}
          <div className="flex gap-2 shrink-0 pt-1">
            {isOwner && (
              <Link to="/timeline/artifacts/edit/$id" params={{ id: data.id }}>
                <EditButton />
              </Link>
            )}
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-6 text-slate-500 text-sm border-b border-slate-100 pb-6 w-full">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>
              {data.publishedAt
                ? new Date(data.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Draft'}
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              to="/profile/$id/$userName"
              params={{ id: data.user.id, userName: data.user.userName }}
            >
              <Avatar
                src={data.user.avatarUrl ?? undefined}
                alt={data.user.userName}
                className="w-12 h-12 border border-slate-100"
              />
            </Link>
            <div className="flex flex-col justify-center">
              <Link
                to="/profile/$id/$userName"
                params={{ id: data.user.id, userName: data.user.userName }}
                className="font-bold text-slate-900 hover:underline text-lg"
              >
                {data.user.userName}
              </Link>
            </div>
          </div>

          <Link
            to="/profile/$id/$userName"
            params={{ id: data.user.id, userName: data.user.userName }}
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-colors">
              Profile
              <span className="text-lg leading-none">&rarr;</span>
            </button>
          </Link>
        </div>

        {/* AI Summary */}
        {data.summaryByAI && <AISummary summary={data.summaryByAI} />}

        {/* Body */}
        <div className="mt-2">
          <MarkdownViewer
            mdSource={data.body}
            className="text-lg text-slate-800 leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}

export default ArtifactDetail
