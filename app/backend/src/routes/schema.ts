import z from 'zod'

const demoQuerySchema = z.object({
  kind: z.enum(['positive', 'negative']),
})

const demoResponseSchema = z.object({
  message: z.string(),
})

export { demoQuerySchema, demoResponseSchema }
