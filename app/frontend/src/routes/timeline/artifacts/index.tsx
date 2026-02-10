import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useFetchArtifactsOptions } from '@/api/routes/artifacts'

import { ARTIFACT_FILTERS } from '@/features/timeline/artifacts/constants'

const artifactsSearchSchema = z.object({
  filter: z.enum(ARTIFACT_FILTERS).optional().catch('newest'),
})

export const Route = createFileRoute('/timeline/artifacts/')({
  validateSearch: artifactsSearchSchema,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(useFetchArtifactsOptions())
  },
})
