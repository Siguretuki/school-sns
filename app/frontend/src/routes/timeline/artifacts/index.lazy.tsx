import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useFetchArtifactsOptions } from '@/api/routes/artifacts'
import Popover from '@/components/layout/Popover'
import NewPostButton from '@/features/timeline/components/NewPostButton'
import ArtifactPreview from '@/components/ui/ArtifactPreview'
import StickyFilterBar from '@/components/ui/StickyFilterBar'
import {
  ARTIFACT_FILTERS,
  ARTIFACT_FILTER_LABELS,
} from '@/features/timeline/artifacts/constants'

export const Route = createLazyFileRoute('/timeline/artifacts/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(useFetchArtifactsOptions())
  const { filter } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <div className="w-full">
      <StickyFilterBar
        items={ARTIFACT_FILTERS}
        selected={filter || 'newest'}
        getLabel={(f) => ARTIFACT_FILTER_LABELS[f]}
        onSelect={(f) => navigate({ search: { filter: f } })}
      />
      <div className="flex flex-col gap-3 px-2 mt-3">
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
      </div>
      <Popover>
        <Link to="/timeline/artifacts/create">
          <NewPostButton variant="new" />
        </Link>
      </Popover>
    </div>
  )
}
