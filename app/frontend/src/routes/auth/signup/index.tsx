import { createFileRoute, redirect } from '@tanstack/react-router'
import z from 'zod'

const signupSearchSchema = z.object({
  google: z.enum(['success', 'error']).optional(),
})

export const Route = createFileRoute('/auth/signup/')({
  validateSearch: signupSearchSchema,
  beforeLoad: ({ search }) => {
    if (search.google === 'success') {
      throw redirect({ to: '/' })
    }
  },
})
