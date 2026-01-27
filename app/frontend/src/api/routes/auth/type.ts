import type { loginSchema, signupSchema } from 'backend/src/routes/auth/schema'
import type z from 'zod'

type LoginRequestBody = z.infer<typeof loginSchema>
type SignupRequestBody = z.infer<typeof signupSchema>

export type { LoginRequestBody, SignupRequestBody }
