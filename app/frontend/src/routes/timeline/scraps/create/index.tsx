import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { useFetchTagsOptions } from '@/api/routes/tags'

const baseSearchParamsSchema = z.object({
  replyTo: z.string().nullable().default(null),
})

const searchParamsSchema = z.union([
  baseSearchParamsSchema.extend({
    shareArtifactId: z.string(),
    shareArtifactTitle: z.string(),
  }),
  baseSearchParamsSchema.extend({
    shareArtifactId: z.null().default(null),
    shareArtifactTitle: z.null().default(null),
  }),
])

export const Route = createFileRoute('/timeline/scraps/create/')({
  validateSearch: searchParamsSchema,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(useFetchTagsOptions())
  },
})
