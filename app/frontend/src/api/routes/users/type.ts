import type {
  editUserRequestSchema,
  userContentsQuerySchema,
} from 'backend/src/routes/users/schema'
import type z from 'zod'

type UpdateUserRequestSchema = z.infer<typeof editUserRequestSchema>

type FetchUserContentsQuerySchema = z.infer<typeof userContentsQuerySchema>

export type { FetchUserContentsQuerySchema, UpdateUserRequestSchema }
