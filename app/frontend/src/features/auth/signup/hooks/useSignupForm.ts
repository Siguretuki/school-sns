import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import z from 'zod'
import { useSignupMutation } from '@/api/routes/auth'
import { ApiError } from '@/api/shared/error'

const signupFormSchema = z.object({
  email: z.email('メールアドレスの形式が正しくありません'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  name: z.string().max(30, '表示名は30文字以内で入力してください'),
})

export const useSignupForm = () => {
  const signupMutation = useSignupMutation()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    validators: {
      onSubmit: signupFormSchema,
    },
    onSubmit: ({ value }) => {
      setFormError(null)

      const trimmedName = value.name.trim()
      const payload = {
        ...value,
        name: trimmedName ? trimmedName : undefined,
      }

      signupMutation.mutate(payload, {
        onSuccess: () => {
          navigate({ to: '/' })
        },
        onError: (error) => {
          if (error instanceof ApiError && error.statusCode === 409) {
            setFormError('このメールアドレスは既に使用されています')
            return
          }
          setFormError('登録に失敗しました。時間をおいて再度お試しください。')
        },
      })
    },
  })

  return { form, formError }
}
