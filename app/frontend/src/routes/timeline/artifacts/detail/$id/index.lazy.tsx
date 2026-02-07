import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { Clock, Share } from 'lucide-react'
import { useFetchArtifactsDetailOptions } from '@/api/routes/artifacts'
import UserPreview from '@/components/ui/UserPreview'
import IconWithLabel from '@/components/ui/IconWithLabel'
import MarkdownViewer from '@/features/timeline/components/MarkdownViewer'
import { useFetchSelfInfoOptions } from '@/api/routes/users'
import EditButton from '@/features/timeline/components/EditButton'
import AISummary from '@/features/timeline/artifacts/detail/components/AISummary'

export const Route = createLazyFileRoute('/timeline/artifacts/detail/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { data } = useSuspenseQuery(useFetchArtifactsDetailOptions(params.id))
  const {
    data: { id },
  } = useSuspenseQuery(useFetchSelfInfoOptions())

  return (
    <div className="flex flex-col gap-7 items-center px-3 py-5">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <div className="flex flex-col gap-5 items-center">
        <UserPreview
          id={data.user.id}
          avatarUrl={data.user.avatarUrl}
          name={data.user.userName}
          classNames={{ avatar: 'w-7 h-7', name: 'text-xl' }}
        />
        <IconWithLabel
          icon={() => <Clock size={15} />}
          label={() => (
            <span className="text-sm">
              {data.publishedAt
                ? new Date(data.publishedAt).toLocaleString()
                : 'Unpublished'}
            </span>
          )}
        />
        <Link
          to="/timeline/scraps/create"
          search={{ shareArtifactId: data.id, shareArtifactTitle: data.title }}
        >
          <IconWithLabel
            icon={() => <Share size={18} />}
            label={() => <span className="">Share to Scrap</span>}
          />
        </Link>
      </div>
      {data.summaryByAI !== null && <AISummary summary={data.summaryByAI} />}
      <MarkdownViewer mdSource={data.body} className="max-w-3xl w-full" />
      {data.user.id === id && (
        <Link to="/timeline/artifacts/edit/$id" params={{ id: data.id }}>
          <EditButton />
        </Link>
      )}
    </div>
  )
}
