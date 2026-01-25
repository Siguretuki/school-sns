import type { loginSchema } from 'backend/src/routes/auth/schema'
import type z from 'zod'

type LoginRequestBody = z.infer<typeof loginSchema>

export type { LoginRequestBody }
