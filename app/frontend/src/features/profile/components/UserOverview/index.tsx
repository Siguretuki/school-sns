import { Link } from '@tanstack/react-router'
import UserPreview from '@/components/ui/UserPreview'
import CountViewer from '@/features/profile/components/CountViewer'

interface Props {
  id: string
  userName: string
  avatarUrl: string | null
  bio: string | null
  followersCount: number
  followingCount: number
  artifactsCount: number
}

const UserOverview: React.FC<Props> = ({
  id,
  userName,
  avatarUrl,
  bio,
  followersCount,
  followingCount,
  artifactsCount,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <UserPreview
        id={id}
        avatarUrl={avatarUrl}
        name={userName}
        classNames={{
          container: 'py-2',
          avatar: 'h-10 w-10',
          name: 'text-xl',
        }}
      />
      {bio && <p className="text-sm text-gray-600">{bio}</p>}
      <div className="py-2 px-5 flex gap-3 border-y border-slate-600 justify-between">
        <Link to="/profile/$id/$userName/followers" params={{ id, userName }}>
          <CountViewer label="Followers" count={followersCount} />
        </Link>
        <Link to="/profile/$id/$userName/following" params={{ id, userName }}>
          <CountViewer label="Following" count={followingCount} />
        </Link>
        <CountViewer label="Artifacts" count={artifactsCount} />
      </div>
    </div>
  )
}

export default UserOverview
