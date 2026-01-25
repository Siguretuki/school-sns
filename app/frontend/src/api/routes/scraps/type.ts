import type z from 'zod'
import type { getScrapsQuerySchema } from 'backend/src/routes/scraps/schema'

type GetScrapsQuerySchema =
  | Partial<NonNullable<z.infer<typeof getScrapsQuerySchema>>>
  | undefined

export type { GetScrapsQuerySchema }
