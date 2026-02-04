import { createFileRoute } from '@tanstack/react-router'
import { useFetchTagsOptions } from '@/api/routes/tags'

export const Route = createFileRoute('/timeline/artifacts/create/')({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(useFetchTagsOptions())
  },
})
