import { Link } from '@tanstack/react-router'
import { Heart, MessageSquare } from 'lucide-react'
import type { Owner } from '@/features/timeline/types'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'
import IconWithLabel from '@/components/ui/IconWithLabel'
import MarkdownViewer from '@/features/timeline/components/MarkdownViewer'

interface Props {
  owner: Owner
  scrap: {
    id: string
    content: string
  }
  className?: string
}

const ScrapPreview: React.FC<Props> = ({ owner, scrap, className }) => {
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
        className={cn(
          'flex flex-col bg-slate-100/80 border border-slate-400/60 px-2 py-3 rounded-lg',
          className,
        )}
      >
        <IconWithLabel
          className="gap-3"
          icon={() => (
            <Avatar
              src={owner.avatarUrl ?? undefined}
              alt={owner.name}
              className="w-6 h-6 "
            />
          )}
          label={() => (
            <span className="font-bold text-xl pb-1.5">{owner.name}</span>
          )}
        />
        <MarkdownViewer
          mdSource={scrap.content}
          className="text-slate-800 whitespace-pre-wrap wrap-break-words"
        />
        <div className="flex flex-row gap-4 w-full justify-start">
          <IconWithLabel
            icon={() => <Heart className="text-slate-400" />}
            label={() => <span className="text-slate-600">0</span>}
          />
          <IconWithLabel
            icon={() => <MessageSquare className="text-slate-400" />}
            label={() => <span className="text-slate-600">0</span>}
          />
        </div>
      </Link>
    </div>
  )
}

export default ScrapPreview
