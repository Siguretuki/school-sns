import { Heart, MessageSquare, Share } from 'lucide-react'

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
          className="flex items-center gap-1.5 p-2 rounded-full hover:bg-pink-50 transition-colors group"
        >
          <Heart
            className={`w-[22px] h-[22px] transition-colors ${isLiked ? 'stroke-pink-600 fill-pink-600' : 'text-slate-500 group-hover:text-pink-500'}`}
          />
          {likesCount > 0 && (
            <span
              className={`text-sm ${isLiked ? 'text-pink-600' : 'text-slate-500 group-hover:text-pink-500'}`}
            >
              {likesCount}
            </span>
          )}
        </button>

        <button
          onClick={onReply}
          className="flex items-center gap-1.5 p-2 rounded-full hover:bg-sky-50 transition-colors group"
        >
          <MessageSquare className="text-slate-500 w-[22px] h-[22px] group-hover:text-sky-500" />
          {commentsCount > 0 && (
            <span className="text-sm text-slate-500 group-hover:text-sky-500">
              {commentsCount}
            </span>
          )}
        </button>
      </div>

      <button className="p-2 rounded-full hover:bg-slate-100 transition-colors group">
        <Share className="text-slate-500 w-[24px] h-[24px] group-hover:text-slate-700" />
      </button>
    </div>
  )
}

export default Actions
