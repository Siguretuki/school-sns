import z from 'zod'

const mediaResponseSchema = z.object({
  id: z.string(),
  url: z.string(),
  userId: z.string(),
  fileType: z.string(),
  originalName: z.string(),
  sizeBytes: z.coerce.number(),
  createdAt: z.coerce.string(),
})

const getMediaQuerySchema = z
  .object({
    limit: z.coerce.number().min(1).optional(),
    page: z.coerce.number().min(1).optional(),
  })
  .optional()

export { getMediaQuerySchema, mediaResponseSchema }
