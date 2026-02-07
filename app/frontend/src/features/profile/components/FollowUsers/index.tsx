import UserPreview from '@/components/ui/UserPreview'

interface Props {
  userName: string
  labelType: 'followers' | 'following'
  users: Array<{
    id: string
    userName: string
    avatarUrl: string | null
  }>
}

const FollowUsers: React.FC<Props> = ({ userName, labelType, users }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">
          {labelType === 'followers' ? 'Followers' : 'Following'}
        </h2>
        <span className="text-sm text-gray-500">{userName}</span>
      </div>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <UserPreview
            key={user.id}
            id={user.id}
            name={user.userName}
            avatarUrl={user.avatarUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default FollowUsers
