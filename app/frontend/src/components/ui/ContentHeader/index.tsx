import { Link } from '@tanstack/react-router'
import { MoreHorizontal } from 'lucide-react'
import EditButton from '@/features/timeline/components/EditButton'

interface Props {
  title: string
  artifactId: string
  isOwner: boolean
}

const Header: React.FC<Props> = ({ title, artifactId, isOwner }) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
        {title}
      </h1>

      <div className="flex gap-2 shrink-0">
        {isOwner && (
          <Link to="/timeline/artifacts/edit/$id" params={{ id: artifactId }}>
            <EditButton />
          </Link>
        )}
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  )
}

export default Header
