import { z } from 'zod'

// サインアップ用のバリデーション
const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().max(30).optional(),
})

// ログイン用のバリデーション
const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
})

const tokenResponseSchema = z.object({
  token: z.string(),
})

export { signupSchema, loginSchema, tokenResponseSchema }
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TokenResponse = z.infer<typeof tokenResponseSchema>
