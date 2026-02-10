import z from 'zod'

const scrapSchema = z.object({
  id: z.string(),
  userId: z.string(),
  parentId: z.string().nullable(),
  body: z.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string(),
})

const registerScrapSchema = z.object({
  parentId: z.string().nullable().default(null),
  body: z.string(),
  tagIds: z.array(z.string()).optional(),
})

const updateScrapSchema = z.object({
  body: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
})

const getScrapsQuerySchema = z
  .object({
    isFollowing: z
      .preprocess((val) => val === 'true', z.boolean())
      .default(false),
    tagIds: z
      .preprocess(
        (val) => (typeof val === 'string' ? [val] : val),
        z.array(z.string()),
      )
      .optional(),
    limit: z.coerce.number().min(1).optional(),
    page: z.coerce.number().min(1).optional(),
    onlyRootScraps: z
      .preprocess((val) => val === 'true', z.boolean())
      .default(true),
  })
  .optional()

export {
  scrapSchema,
  getScrapsQuerySchema,
  registerScrapSchema,
  updateScrapSchema,
}
