import { Link } from '@tanstack/react-router'
import Divider from '@/components/layout/Divider'
import Avatar from '@/components/ui/Avatar'
import CountViewer from '@/features/profile/components/CountViewer'

interface Props {
  id: string
  userName: string
  avatarUrl: string | null
  bio: string | null
  followersCount: number
  followingCount: number
}

const UserOverview: React.FC<Props> = ({
  id,
  userName,
  avatarUrl,
  bio,
  followersCount,
  followingCount,
}) => {
  const handle = userName.startsWith('@') ? userName : `@${userName}`

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="p-0.5 rounded-full bg-linear-to-tr from-sky-500 via-violet-500 to-blue-400">
            <Avatar
              src={avatarUrl ?? undefined}
              alt={userName}
              className="h-20 w-20 border-2 border-white"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-slate-900">{userName}</h1>
          <span className="text-sm text-slate-500">{handle}</span>
          {bio && (
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              {bio}
            </p>
          )}
        </div>
      </div>
      <div className="flex w-full justify-between gap-2 border-y border-slate-200 px-2 py-3">
        <Link
          to="/profile/$id/$userName/followers"
          params={{ id, userName }}
          className="flex-1"
        >
          <CountViewer label="Followers" count={followersCount} />
        </Link>
        <Divider orientation="vertical" />
        <Link
          to="/profile/$id/$userName/following"
          params={{ id, userName }}
          className="flex-1"
        >
          <CountViewer label="Following" count={followingCount} />
        </Link>
      </div>
    </div>
  )
}

export default UserOverview
