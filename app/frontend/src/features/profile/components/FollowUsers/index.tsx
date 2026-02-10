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
  const title = labelType === 'followers' ? 'Followers' : 'Following'
  const handle = userName.startsWith('@') ? userName : `@${userName}`

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <span className="text-sm text-slate-500">{handle}</span>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {users.length}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="flex flex-col divide-y divide-slate-100">
          {users.map((user) => (
            <UserPreview
              key={user.id}
              id={user.id}
              name={user.userName}
              avatarUrl={user.avatarUrl}
              classNames={{
                container:
                  'group flex items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50',
                avatar:
                  'w-10 h-10 ring-2 ring-white shadow-sm group-hover:scale-[1.02] transition-transform',
                name: 'text-base font-semibold text-slate-900',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FollowUsers
