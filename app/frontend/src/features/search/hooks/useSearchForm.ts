import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { SearchHistoryStorage } from '@/features/search/lib/searchHistoryStorage'

const searchFormSchema = z.object({
  keyword: z.string().nullable(),
})

type SearchForm = z.infer<typeof searchFormSchema>

export const useSearchForm = (defaultValues: SearchForm) => {
  const navigate = useNavigate()
  const manager = new SearchHistoryStorage()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
    },
    validators: {
      onSubmit: searchFormSchema,
    },
    onSubmit: ({ value: { keyword } }) => {
      if (keyword !== null) {
        manager.addHistory(keyword)
        return navigate({
          to: '/search/result',
          search: (old) => ({
            ...old,
            keyword: keyword,
          }),
        })
      }

      navigate({
        to: '/search',
        search: (old) => ({ ...old, keyword: null }),
      })
    },
  })

  return { form }
}
