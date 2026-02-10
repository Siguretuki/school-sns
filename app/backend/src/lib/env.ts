import { config } from 'dotenv'
import { z } from 'zod'

const envFile = '.env'

// 明示的に読み込む
config({ path: envFile })

class EnvError extends Error {
  constructor(message: string) {
    super(`Environment Variable Error: ${message}`)
    this.name = 'EnvError'
  }
}

const zStrEnv = z.string().min(1, 'is required')

const EnvSchema = z.object({
  DATABASE_URL: zStrEnv,
  TOKEN_EXPIRATION_SEC: z
    .string()
    .nullable()
    .transform((val) => Number(val) || null),
  LLM_PROVIDER: z.enum(['fake', 'google']).default('fake'),
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  PROVIDER_TYPE: z.string().default('sqlserver'),
  ORIGIN_URL: z.string().default('http://localhost:3157'),
})
// .transform((env) => {
//   return {
//     ...env,
//     GOOGLE_REDIRECT_URI: `${env.ORIGIN_URL}${env.GOOGLE_REDIRECT_URI}`,
//   }
// })

const validateEnv = () => {
  try {
    return EnvSchema.parse(process.env)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formatted = err.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ')
      throw new EnvError(formatted)
    }
    throw err
  }
}

export const env = validateEnv()
