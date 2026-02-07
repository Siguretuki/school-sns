import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { useFetchTagsOptions } from '@/api/routes/tags'

const searchParamsSchema = z.object({
  replyTo: z.string().nullable().default(null),
  shareArtifactId: z.string().nullable().default(null),
})

export const Route = createFileRoute('/timeline/scraps/create/')({
  validateSearch: searchParamsSchema,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(useFetchTagsOptions())
  },
})
