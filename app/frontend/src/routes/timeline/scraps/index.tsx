import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { useFetchScrapsOptions } from '@/api/routes/scraps'
import { FILTERS } from '@/features/timeline/scraps/constants'

const searchParamsSchema = z.object({
  filter: z.enum(FILTERS).default('all'),
})

export const Route = createFileRoute('/timeline/scraps/')({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({ isFollowing: search.filter === 'following' }),
  loader: ({ context, deps: { isFollowing } }) =>
    context.queryClient.ensureQueryData(
      useFetchScrapsOptions({
        isFollowing,
      }),
    ),
})
