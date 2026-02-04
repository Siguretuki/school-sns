import { useNavigate } from '@tanstack/react-router'
import { usePostScrap } from '@/api/routes/scraps'
import { useScrapForm } from '@/features/timeline/scraps/hooks/useScrapForm'

export const usePostScrapForm = (replyToScrapId: string | null = null) => {
  const mutation = usePostScrap()
  const navigate = useNavigate()

  return useScrapForm({
    onSubmit: (value) => {
      mutation.mutate(
        { ...value, parentId: replyToScrapId },
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
