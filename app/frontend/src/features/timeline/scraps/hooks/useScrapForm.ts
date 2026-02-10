import { useForm } from '@tanstack/react-form'
import z from 'zod'

const postScrapFormSchema = z.object({
  body: z.string().min(1, 'Body is required'),
  tags: z.array(z.string()),
})

export type ScrapFormValues = z.infer<typeof postScrapFormSchema>

export const useScrapForm = (args: {
  initialValues?: Partial<ScrapFormValues>
  onSubmit: (value: ScrapFormValues) => void
}) => {
  const form = useForm({
    defaultValues: {
      body: args.initialValues?.body ?? '',
      tags: args.initialValues?.tags ?? [],
    },
    validators: {
      onSubmit: postScrapFormSchema,
    },
    onSubmit: ({ value }) => {
      args.onSubmit(value)
    },
  })

  return { form }
}
