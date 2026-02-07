import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import type { ProfileTab } from '@/features/profile/types'
import {
  useFetchSelfInfoOptions,
  useFetchUserContentsOptions,
  useFetchUserFollowersOptions,
  useFetchUserInfoOptions,
} from '@/api/routes/users'

const searchParamsSchema = z.object({
  contentsType: z
    .enum(['artifacts', 'scraps'])
    .default('scraps') satisfies z.ZodType<ProfileTab>,
})

export const Route = createFileRoute('/profile/$id/$userName/')({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({ ...search }),
  loader: ({ context: { queryClient }, params: { id }, deps }) => {
    queryClient.ensureQueryData(useFetchUserInfoOptions(id))
    queryClient.ensureQueryData(
      useFetchUserContentsOptions(id, { type: deps.contentsType }),
    )
    queryClient.ensureQueryData(useFetchSelfInfoOptions())
    queryClient.ensureQueryData(useFetchUserFollowersOptions(id))
  },
})
