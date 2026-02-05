import { Link } from '@tanstack/react-router'
import Avatar from '@/components/ui/Avatar'

interface Props {
  users: Array<{
    id: string
    userName: string
    avatarUrl: string | null
  }>
}

const UserResult: React.FC<Props> = ({ users }) => {
  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <Link
          key={user.id}
          to="/profile/$id/$userName"
          params={{ id: user.id, userName: user.userName }}
        >
          <div className="flex items-center gap-2 p-2">
            <Avatar
              src={user.avatarUrl ?? undefined}
              alt={user.userName}
              size={10}
            />
            <span className="font-medium text-slate-800">{user.userName}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default UserResult
