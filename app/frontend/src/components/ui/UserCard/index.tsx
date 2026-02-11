import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'

interface Props {
  userId: string
  userName: string
  avatarUrl: string | null
}

const UserCard: React.FC<Props> = ({ userId, userName, avatarUrl }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Link
          to="/profile/$id/$userName"
          params={{ id: userId, userName: userName }}
        >
          <Avatar
            src={avatarUrl ?? undefined}
            alt={userName}
            className="w-12 h-12 border border-slate-100"
          />
        </Link>
        <div className="flex flex-col justify-center">
          <Link
            to="/profile/$id/$userName"
            params={{ id: userId, userName: userName }}
            className="font-bold text-slate-900 hover:underline text-lg"
          >
            {userName}
          </Link>
        </div>
      </div>

      <Link
        to="/profile/$id/$userName"
        params={{ id: userId, userName: userName }}
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-colors">
          Profile
          <ArrowRight size={18} />
        </button>
      </Link>
    </div>
  )
}

export default UserCard
