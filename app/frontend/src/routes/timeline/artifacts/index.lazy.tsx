import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useFetchArtifactsOptions } from '@/api/routes/artifacts'
import Popover from '@/components/layout/Popover'
import NewPostButton from '@/features/timeline/components/NewPostButton'
import ArtifactPreview from '@/components/ui/ArtifactPreview'

export const Route = createLazyFileRoute('/timeline/artifacts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(useFetchArtifactsOptions())

  return (
    <div className="flex flex-col gap-4">
      {data
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        )
        .map((artifact) => (
          <ArtifactPreview
            key={artifact.id}
            owner={{
              id: artifact.user.id,
              name: artifact.user.userName,
              avatarUrl: artifact.user.avatarUrl,
            }}
            artifact={{
              id: artifact.id,
              title: artifact.title,
              summaryByAI: artifact.summaryByAI,
              publishedAt: artifact.publishedAt,
            }}
          />
        ))}
      <Popover>
        <Link to="/timeline/artifacts/create">
          <NewPostButton variant="new" />
        </Link>
      </Popover>
    </div>
  )
}
