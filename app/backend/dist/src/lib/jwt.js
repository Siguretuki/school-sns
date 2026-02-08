import { decode, sign } from 'hono/jwt'
import z from 'zod'
import { env } from './env.js'
const payloadSchema = z.object({
  sub: z.string(),
  role: z.string(),
  exp: z.coerce.number(),
})
export const jwt = {
  /**
   * JWT生成の共通関数
   * SignupとLoginの両方で使用します
   */
  generate: async (user) => {
    const payload = {
      sub: user.id,
      role: user.role,
      exp:
        Math.floor(Date.now() / 1000) +
        (env.TOKEN_EXPIRATION_SEC ?? 60 * 60 * 24),
    }
    return await sign(payload, env.JWT_SECRET)
  },
  parse: (token) => {
    return payloadSchema.parse(decode(token).payload)
  },
}
