import { createFileRoute } from '@tanstack/react-router'
import { useFetchUserFollowersOptions } from '@/api/routes/users'

export const Route = createFileRoute('/profile/$id/$userName/followers/')({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(useFetchUserFollowersOptions(params.id))
  },
})
