import { useNavigate } from '@tanstack/react-router'
import { usePostScrapMutation } from '@/api/routes/scraps'
import { useScrapForm } from '@/features/timeline/scraps/hooks/useScrapForm'

export const usePostScrapForm = (args: {
  replyToScrapId: string | null
  shareArtifactId: string | null
}) => {
  const mutation = usePostScrapMutation()
  const navigate = useNavigate()

  return useScrapForm({
    initialValues: {
      body: args.shareArtifactId
        ? `[Shared Artifact](/timeline/artifacts/detail/${args.shareArtifactId})`
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
