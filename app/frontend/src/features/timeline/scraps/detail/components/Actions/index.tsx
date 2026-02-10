import { Heart, MessageSquare, Share } from 'lucide-react'
import IconWithLabel from '@/components/ui/IconWithLabel'

interface Props {
  onLike?: () => void
  onReply?: () => void
  isLiked?: boolean
  likesCount?: number
  commentsCount?: number
}

const Actions: React.FC<Props> = ({
  onLike,
  onReply,
  isLiked,
  likesCount = 0,
  commentsCount = 0,
}) => {
  return (
    <div className="flex flex-row justify-between items-center py-2 px-4 border-b border-slate-100 bg-white">
      <div className="flex flex-row gap-6">
        <button
          onClick={onLike}
          className="rounded-full hover:bg-pink-50 transition-colors group px-2 py-1 -ml-2"
        >
          <IconWithLabel
            icon={() => (
              <Heart
                className={`w-[22px] h-[22px] transition-colors ${isLiked ? 'stroke-pink-600 fill-pink-600' : 'text-slate-500 group-hover:text-pink-500'}`}
              />
            )}
            label={likesCount > 0 ? likesCount.toString() : ''}
            className={`gap-1.5 ${isLiked ? 'text-pink-600' : 'text-slate-500 group-hover:text-pink-500'}`}
          />
        </button>

        <button
          onClick={onReply}
          className="rounded-full hover:bg-sky-50 transition-colors group px-2 py-1"
        >
          <IconWithLabel
            icon={() => (
              <MessageSquare className="text-slate-500 w-[22px] h-[22px] group-hover:text-sky-500" />
            )}
            label={commentsCount > 0 ? commentsCount.toString() : ''}
            className="gap-1.5 text-slate-500 group-hover:text-sky-500"
          />
        </button>
      </div>

      <button className="p-2 rounded-full hover:bg-slate-100 transition-colors group">
        <Share className="text-slate-500 w-[24px] h-[24px] group-hover:text-slate-700" />
      </button>
    </div>
  )
}

export default Actions
