import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { useLoginMutation } from '@/api/routes/auth'

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const useLoginForm = () => {
  const loginMutation = useLoginMutation()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: ({ value }) => {
      console.log('Submitting login form with values:', value)
      loginMutation.mutate(value, {
        onSuccess: () => {
          navigate({ to: '/' })
        },
        onError: (error) => {
          if (error.statusCode === 401) {
            navigate({
              to: '/auth/login',
            })
          }

          navigate({
            to: '/auth/signup',
          })
        },
      })
    },
  })

  return { form }
}
