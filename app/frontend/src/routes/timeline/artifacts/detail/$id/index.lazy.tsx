import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFetchArtifactsDetailOptions } from '@/api/routes/artifacts'
import { useFetchSelfInfoOptions } from '@/api/routes/users'
import ArtifactDetail from '@/features/timeline/artifacts/detail/components/ArtifactDetail'

export const Route = createLazyFileRoute('/timeline/artifacts/detail/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { data } = useSuspenseQuery(useFetchArtifactsDetailOptions(params.id))
  const {
    data: { id: currentUserId },
  } = useSuspenseQuery(useFetchSelfInfoOptions())

  return (
    <div className="flex justify-center w-full px-2 py-2">
      <div className="w-full max-w-4xl">
        <ArtifactDetail data={data} currentUserId={currentUserId} />
      </div>
    </div>
  )
}
