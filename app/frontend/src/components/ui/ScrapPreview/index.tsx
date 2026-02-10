import { Link } from '@tanstack/react-router'
import { Heart, MessageSquare, MoreHorizontal } from 'lucide-react'
import type { Owner } from '@/features/timeline/types'
import type React from 'react'
import { formatDistanceToNowJa } from '@/utils/date'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'
import IconWithLabel from '@/components/ui/IconWithLabel'
import MarkdownViewer from '@/features/timeline/components/MarkdownViewer'

interface Props {
  owner: Owner
  scrap: {
    id: string
    content: string
    createdAt: string
    commentCount?: number
    likeCount?: number
  }
  className?: string
}

const ScrapPreview: React.FC<Props> = ({ owner, scrap, className }) => {
  return (
    <div className="relative group">
      <Link
        to="/profile/$id/$userName"
        params={{ id: owner.id, userName: owner.name }}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full"
      />

      <Link
        to="/timeline/scraps/detail/$id"
        params={{ id: scrap.id }}
        className={cn(
          'flex flex-col bg-white border border-slate-200 shadow-sm rounded-xl p-4',
          className,
        )}
      >
        <div className="flex justify-between items-center mb-2">
          <IconWithLabel
            className="gap-3"
            icon={() => (
              <Avatar
                src={owner.avatarUrl ?? undefined}
                alt={owner.name}
                className="w-10 h-10"
              />
            )}
            label={() => (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 line-clamp-1 break-all">
                  {owner.name}
                </span>
                <span className="text-slate-500 text-sm shrink-0">•</span>
                <span className="text-slate-500 text-sm whitespace-nowrap shrink-0">
                  {formatDistanceToNowJa(new Date(scrap.createdAt))}
                </span>
              </div>
            )}
          />
          <button className="text-slate-400 hover:text-slate-600 relative z-20 shrink-0 ml-8">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <MarkdownViewer
          mdSource={scrap.content}
          className="text-slate-800 whitespace-pre-wrap break-words text-base mb-3 leading-relaxed"
        />

        <div className="flex flex-row gap-6 w-full justify-start">
          <IconWithLabel
            className="gap-1.5 group/heart"
            icon={() => (
              <Heart
                size={18}
                className="text-slate-500 group-hover/heart:stroke-pink-500 transition-colors"
              />
            )}
            label={() => (
              <span className="text-sm font-medium text-slate-500 group-hover/heart:text-pink-500 transition-colors">
                {scrap.likeCount ?? 0}
              </span>
            )}
          />
          <IconWithLabel
            className="gap-1.5 group/comment"
            icon={() => (
              <MessageSquare
                size={18}
                className="text-slate-500 group-hover/comment:stroke-blue-500 transition-colors"
              />
            )}
            label={() => (
              <span className="text-sm font-medium text-slate-500 group-hover/comment:text-blue-500 transition-colors">
                {scrap.commentCount ?? 0}
              </span>
            )}
          />
        </div>
      </Link>
    </div>
  )
}

export default ScrapPreview
