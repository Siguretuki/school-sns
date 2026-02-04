import { useNavigate } from '@tanstack/react-router'
import type { ArtifactFormValues } from '@/features/timeline/artifacts/hooks/useArtifactForm'
import { useUpdateArtifactMutation } from '@/api/routes/artifacts'
import { useArtifactForm } from '@/features/timeline/artifacts/hooks/useArtifactForm'

export const useUpdateArtifactForm = (
  targetId: string,
  initialValues: ArtifactFormValues,
) => {
  const navigate = useNavigate()
  const mutation = useUpdateArtifactMutation(targetId)

  return useArtifactForm({
    initialValues,
    onSubmit: (value) => {
      mutation.mutate(
        {
          title: initialValues.title !== value.title ? value.title : undefined,
          body: initialValues.body !== value.body ? value.body : undefined,
          status:
            initialValues.status !== value.status ? value.status : undefined,
          tagIds:
            JSON.stringify(value.tags) !== JSON.stringify(initialValues.tags)
              ? value.tags
              : undefined,
        },
        {
          onSuccess: () => {
            navigate({
              to: '/timeline/artifacts/detail/$id',
              params: { id: targetId },
            })
          },
        },
      )
    },
  })
}
