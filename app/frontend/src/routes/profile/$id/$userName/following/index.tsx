import { createFileRoute } from '@tanstack/react-router'
import { useFetchUserFollowingsOptions } from '@/api/routes/users'

export const Route = createFileRoute('/profile/$id/$userName/following/')({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(useFetchUserFollowingsOptions(params.id))
  },
})
