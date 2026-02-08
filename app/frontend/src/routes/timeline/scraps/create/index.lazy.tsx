import { createLazyFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usePostScrapForm } from '@/features/timeline/scraps/create/hooks/usePostScrpaForm'
import { useFetchTagsOptions } from '@/api/routes/tags'
import ScrapEditor from '@/features/timeline/scraps/components/ScrapEditor'

export const Route = createLazyFileRoute('/timeline/scraps/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { replyTo, shareArtifactId, shareArtifactTitle } = Route.useSearch()
  const { form } = usePostScrapForm({
    replyToScrapId: replyTo,
    shareArtifact:
      shareArtifactId !== null
        ? { id: shareArtifactId, title: shareArtifactTitle }
        : null,
  })

  const { data: tags } = useSuspenseQuery(useFetchTagsOptions())

  return <ScrapEditor form={form} tags={tags} submitLabel="投稿" />
}
