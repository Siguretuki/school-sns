import { useNavigate } from '@tanstack/react-router'
import type { ScrapFormValues } from '@/features/timeline/scraps/hooks/useScrapForm'
import { useUpdateScrap } from '@/api/routes/scraps'
import { useScrapForm } from '@/features/timeline/scraps/hooks/useScrapForm'

export const usePostScrapForm = (
  targetId: string,
  initialValues: ScrapFormValues,
) => {
  const mutation = useUpdateScrap(targetId)
  const navigate = useNavigate()

  return useScrapForm({
    initialValues,
    onSubmit: (value) => {
      mutation.mutate(value, {
        onSuccess: () => {
          navigate({
            to: '/timeline/scraps/detail/$id',
            params: { id: targetId },
          })
        },
      })
    },
  })
}
