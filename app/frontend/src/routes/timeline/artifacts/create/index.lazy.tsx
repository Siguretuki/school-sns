import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFetchTagsOptions } from '@/api/routes/tags'
import { usePostArtifactForm } from '@/features/timeline/artifacts/create/hooks/usePostArtifactForm'
import ArtifactEditor from '@/features/timeline/artifacts/components/ArtifactEditor'

export const Route = createLazyFileRoute('/timeline/artifacts/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: tags } = useSuspenseQuery(useFetchTagsOptions())
  const { form } = usePostArtifactForm()

  return <ArtifactEditor form={form} tags={tags} />
}
