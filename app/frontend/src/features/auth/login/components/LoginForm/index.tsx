import { LockKeyhole, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import InputWithIcon from '@/features/auth/components/InputWithIcon'
import { useLoginForm } from '@/features/auth/login/hooks/useLoginForm'

const LoginForm: React.FC = () => {
  const { form } = useLoginForm()

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col gap-4">
          <form.Field name="email">
            {(field) => (
              <div className="flex flex-col gap-2 items-start">
                <label htmlFor={field.name}>メールアドレス</label>
                <InputWithIcon
                  type="email"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="tech@example.com"
                  icon={Mail}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-2 items-start">
                <label htmlFor={field.name}>パスワード</label>
                <InputWithIcon
                  type="password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="********"
                  icon={LockKeyhole}
                />
              </div>
            )}
          </form.Field>
          <p className="text-sm text-right hover:underline cursor-pointer">
            パスワードをお忘れですか？
          </p>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'ログイン中...' : 'ログイン'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
