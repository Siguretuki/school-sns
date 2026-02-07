import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from '@/api/routes/users'
import Button from '@/components/ui/Button'

interface Props {
  targetUserId: string
  isFollowing: boolean
}

const FollowButton: React.FC<Props> = ({ targetUserId, isFollowing }) => {
  const followMutation = useFollowUserMutation()
  const unfollowMutation = useUnfollowUserMutation()

  return (
    <Button
      onClick={() => {
        if (isFollowing) {
          unfollowMutation.mutate(targetUserId)
        } else {
          followMutation.mutate(targetUserId)
        }
      }}
      disabled={followMutation.isPending || unfollowMutation.isPending}
      className="w-full text-lg font-medium"
    >
      {followMutation.isPending || unfollowMutation.isPending
        ? 'Processing...'
        : isFollowing
          ? 'Unfollow'
          : 'Follow'}
    </Button>
  )
}

export default FollowButton
