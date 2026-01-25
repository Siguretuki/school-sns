import { Link } from '@tanstack/react-router'
import { Heart, MessageSquare } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'

interface Props {
  owner: {
    id: string
    avatarUrl: string | null
    name: string
  }
  scrap: {
    id: string
    content: string
    createdAt: string
  }
}

const ScrapPreview: React.FC<Props> = ({ owner, scrap }) => {
  return (
    <div className="relative">
      <Link
        to="/profile/$id/$userName"
        params={{ id: owner.id, userName: owner.name }}
        className="absolute top-4.5 left-4 z-10 w-6 h-6 rounded-full"
      />

      <Link
        to="/timeline/scraps/detail/$id"
        params={{ id: scrap.id }}
        className="flex flex-col bg-slate-100/80 border border-slate-400/60 px-4 py-3 rounded-lg shadow-sm gap-3"
      >
        <div className="flex flex-row gap-3 items-center">
          <Avatar
            src={owner.avatarUrl ?? undefined}
            alt={owner.name}
            className="w-6 h-6 "
          />
          <span className="font-bold text-xl pb-1.5">{owner.name}</span>
        </div>
        <div>
          <p className="text-slate-800 whitespace-pre-wrap wrap-break-words">
            {scrap.content}
          </p>
        </div>
        <div className="flex flex-row gap-4 w-full justify-start">
          <div className="flex gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-slate-600">0</span>
          </div>
          <div className="flex gap-2">
            <MessageSquare className="w-5 h-5 text-slate-400" />
            <span className="text-slate-600">0</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ScrapPreview
