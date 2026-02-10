import { Heart, HeartPlus } from 'lucide-react'
import {
  useLikeScrapMutation,
  useUnlikeScrapMutation,
} from '@/api/routes/scraps'
import { cn } from '@/utils/cn'

interface Props {
  isLiked: boolean
  scrapId: string
  parentId?: string
}

const LikeButton: React.FC<Props> = ({ isLiked, scrapId, parentId }) => {
  const likeMutation = useLikeScrapMutation(parentId)
  const unlikeMutation = useUnlikeScrapMutation(parentId)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLiked) {
      unlikeMutation.mutate(scrapId)
    } else {
      likeMutation.mutate(scrapId)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 text-sm font-medium',
        isLiked ? 'text-red-500' : 'text-slate-500 hover:text-slate-700',
      )}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      disabled={likeMutation.isPending || unlikeMutation.isPending}
    >
      {isLiked ? (
        <HeartPlus size={16} className="shrink-0" />
      ) : (
        <Heart size={16} className="shrink-0" />
      )}
    </button>
  )
}

export default LikeButton
