import { createLazyFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { UneditableError } from '@/features/timeline/errors'
import { useFetchArtifactsDetailOptions } from '@/api/routes/artifacts'
import { useFetchTagsOptions } from '@/api/routes/tags'
import { useUpdateArtifactForm } from '@/features/timeline/artifacts/edit/hooks/useUpdateArtifactForm'
import ArtifactEditor from '@/features/timeline/artifacts/components/ArtifactEditor'

export const Route = createLazyFileRoute('/timeline/artifacts/edit/$id/')({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    if (error instanceof UneditableError) {
      return <div>この記事を編集する権限がありません。</div>
    }
    return <div>予期せぬエラーが発生しました。</div>
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const { data } = useSuspenseQuery(useFetchArtifactsDetailOptions(params.id))
  const { data: tags } = useSuspenseQuery(useFetchTagsOptions())

  const { form } = useUpdateArtifactForm(params.id, {
    title: data.title,
    body: data.body,
    status: data.status,
    tags: data.tags.map((tag) => tag.id),
  })

  return <ArtifactEditor form={form} tags={tags} />
}
