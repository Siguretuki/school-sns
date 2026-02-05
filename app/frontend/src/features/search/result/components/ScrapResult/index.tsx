import { Link } from '@tanstack/react-router'
import Avatar from '@/components/ui/Avatar'

interface Props {
  scraps: Array<{
    author: {
      userName: string
      avatarUrl: string | null
    }
    id: string
    title: string
    body: string
  }>
}

const ScrapResult: React.FC<Props> = ({ scraps }) => {
  return (
    <div className="flex flex-col gap-0">
      {scraps.map((scrap) => (
        <Link
          key={scrap.id}
          to="/timeline/scraps/detail/$id"
          params={{ id: scrap.id }}
          className="flex flex-col gap-1 py-2 px-3 border-b border-slate-300 hover:bg-slate-100"
        >
          <div className="flex gap-1">
            <Avatar
              src={scrap.author.avatarUrl ?? undefined}
              alt={scrap.author.userName}
              size={6}
            />
            <span className="text-sm text-slate-700">
              {scrap.author.userName}
            </span>
          </div>
          <h3 className="text-md font-semibold text-slate-900">
            {scrap.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">{scrap.body}</p>
        </Link>
      ))}
    </div>
  )
}

export default ScrapResult
