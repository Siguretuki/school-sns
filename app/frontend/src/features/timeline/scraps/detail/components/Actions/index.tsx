import { MessageSquare } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import IconWithLabel from '@/components/ui/IconWithLabel'
import LikeButton from '@/components/ui/LikeButton'

interface Props {
  likesCount: number
  commentsCount: number
  targetId: string
  isLiked: boolean
}

const Actions: React.FC<Props> = ({
  likesCount,
  commentsCount,
  targetId,
  isLiked,
}) => {
  return (
    <div className="flex flex-row gap-4 py-2 px-4 border-y border-y-slate-800">
      <IconWithLabel
        icon={() => <LikeButton isLiked={isLiked} scrapId={targetId} />}
        label={() => <span className="text-slate-600">{likesCount}</span>}
      />
      <Link
        to="/timeline/scraps/create"
        search={{
          replyTo: targetId,
        }}
        className="rounded"
      >
        <IconWithLabel
          icon={() => <MessageSquare className="text-slate-600" />}
          label={() => <span className="text-slate-600">{commentsCount}</span>}
        />
      </Link>
    </div>
  )
}

export default Actions
