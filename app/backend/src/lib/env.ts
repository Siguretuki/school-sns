import 'dotenv/config'
import { z } from 'zod'

class EnvError extends Error {
  constructor(message: string) {
    super(`Environment Variable Error: ${message}`)
    this.name = 'EnvError'
  }
}

const zStrEnv = z.string().min(1, 'is required')

const EnvSchema = z.object({
  DATABASE_URL: zStrEnv,
})

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
