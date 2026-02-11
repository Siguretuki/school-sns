import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFetchScrapDetailOptions } from '@/api/routes/scraps'
import { useUpdateScrapForm } from '@/features/timeline/scraps/edit/hooks/useUpdateScrapForm'
import { useFetchTagsOptions } from '@/api/routes/tags'
import ScrapEditor from '@/features/timeline/scraps/components/ScrapEditor'
import { UneditableError } from '@/features/timeline/errors'

export const Route = createLazyFileRoute('/timeline/scraps/edit/$id/')({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    if (error instanceof UneditableError) {
      return <div>このスクラップを編集する権限がありません。</div>
    }
    return <div>予期せぬエラーが発生しました。</div>
  },
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data } = useSuspenseQuery(useFetchScrapDetailOptions(id))
  const { data: tags } = useSuspenseQuery(useFetchTagsOptions())

  const { form } = useUpdateScrapForm(id, {
    title: data.title,
    body: data.body,
    tags: data.tags.map((t) => t.id),
  })

  return <ScrapEditor form={form} tags={tags} submitLabel="更新" />
}
