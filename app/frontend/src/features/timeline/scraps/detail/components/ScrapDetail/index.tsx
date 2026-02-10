import { Link } from '@tanstack/react-router'
import type { Owner } from '@/features/timeline/types'
import UserPreview from '@/components/ui/UserPreview'
import EditButton from '@/features/timeline/components/EditButton'
import MarkdownViewer from '@/features/timeline/components/MarkdownViewer'

interface Props {
  owner: Owner
  scrap: {
    id: string
    body: string
    createdAt: string
    updatedAt: string
  }
  isEditable: boolean
}

const ScrapDetail: React.FC<Props> = ({ owner, scrap, isEditable }) => {
  return (
    <div className="flex flex-col gap-2 px-2 py-3 bg-slate-50">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <UserPreview
            id={owner.id}
            avatarUrl={owner.avatarUrl}
            name={owner.name}
            classNames={{ avatar: 'w-8 h-8', name: 'text-lg' }}
          />
        </div>
        {isEditable && (
          <Link
            to="/timeline/scraps/edit/$id"
            params={{ id: scrap.id }}
            className=""
          >
            <EditButton />
          </Link>
        )}
      </div>
      <MarkdownViewer
        mdSource={scrap.body}
        className="px-2 text-slate-700 whitespace-pre-wrap wrap-break-words"
      />
      <div className="flex flex-col gap-1 text-sm text-slate-500">
        <span>Created at: {new Date(scrap.createdAt).toLocaleString()}</span>
        <span>Updated at: {new Date(scrap.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  )
}

export default ScrapDetail
