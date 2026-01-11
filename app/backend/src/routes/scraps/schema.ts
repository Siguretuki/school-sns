import z from 'zod'

const scrapSchema = z.object({
  id: z.string(),
  userId: z.string(),
  parentId: z.string().nullable(),
  title: z.string().min(1),
  body: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string(),
})

const registerScrapSchema = z.object({
  parentId: z.string().nullable().default(null),
  title: z.string().min(1),
  body: z.string(),
  tagIds: z.array(z.string()).optional(),
})

const updateScrapSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
})

const getScrapsQuerySchema = z
  .object({
    isFollowing: z
      .preprocess((val) => val === 'true', z.boolean())
      .default(false),
    limit: z.coerce.number().min(1).optional(),
    page: z.coerce.number().min(1).optional(),
  })
  .optional()

export {
  scrapSchema,
  getScrapsQuerySchema,
  registerScrapSchema,
  updateScrapSchema,
}
