import { UserCheck, UserPlus } from 'lucide-react'
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '@/api/routes/users'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface Props {
  targetUserId: string
  isFollowing: boolean
  className?: string
}

const FollowButton: React.FC<Props> = ({
  targetUserId,
  isFollowing,
  className,
}) => {
  const followMutation = useFollowUserMutation()
  const unfollowMutation = useUnfollowUserMutation()
  const isPending = followMutation.isPending || unfollowMutation.isPending
  const label = isPending
    ? 'Processing...'
    : isFollowing
      ? 'Unfollow'
      : 'Follow'
  const Icon = isFollowing ? UserCheck : UserPlus

  const buttonClasses = cn(
    'text-sm font-bold rounded-lg flex items-center justify-center gap-2 h-10 transition-colors',
    isFollowing
      ? 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
      : 'bg-sky-500 hover:bg-sky-500/90 text-white',
    className,
  )

  return (
    <Button
      onClick={() => {
        if (isFollowing) {
          unfollowMutation.mutate(targetUserId)
        } else {
          followMutation.mutate(targetUserId)
        }
      }}
      disabled={isPending}
      className={buttonClasses}
      aria-busy={isPending}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
}

export default FollowButton
