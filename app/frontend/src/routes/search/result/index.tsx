import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import type { SearchType } from '@/features/search/types'
import { invokeSearch } from '@/api/routes/search'

const searchParamsSchema = z.object({
  keyword: z.string(),
  type: z
    .enum(['artifact', 'scrap', 'user', 'tag'])
    .default('scrap') satisfies z.ZodType<SearchType>,
})

export const Route = createFileRoute('/search/result/')({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) =>
    await invokeSearch(search.keyword, search.type),
})
