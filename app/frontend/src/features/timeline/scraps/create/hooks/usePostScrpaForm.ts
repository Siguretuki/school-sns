import { useNavigate } from '@tanstack/react-router'
import { usePostScrapMutation } from '@/api/routes/scraps'
import { useScrapForm } from '@/features/timeline/scraps/hooks/useScrapForm'

export const usePostScrapForm = (args: {
  replyToScrapId: string | null
  shareArtifact: { id: string; title: string } | null
}) => {
  const mutation = usePostScrapMutation()
  const navigate = useNavigate()

  return useScrapForm({
    initialValues: {
      body: args.shareArtifact?.id
        ? `[Shared Artifact](/timeline/artifacts/detail/${args.shareArtifact.id})`
        : '',
    },
    onSubmit: (value) => {
      mutation.mutate(
        {
          ...value,
          parentId: args.replyToScrapId,
          tagIds: value.tags.length > 0 ? value.tags : undefined,
        },
        {
          onSuccess: () => {
            navigate({
              to: '/timeline/scraps',
            })
          },
        },
      )
    },
  })
}
