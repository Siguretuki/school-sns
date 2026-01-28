import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import InputWithIcon from '@/features/auth/components/InputWithIcon'
import { useLoginForm } from '@/features/auth/login/hooks/useLoginForm'

const LoginForm: React.FC = () => {
  const { form } = useLoginForm()
  const [showPassword, setShowPassword] = useState(false)

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
              <div className="flex flex-col gap-2">
                <label htmlFor={field.name} className="sr-only">
                  メールアドレス
                </label>
                <InputWithIcon
                  type="email"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="メールアドレス"
                  icon={Mail}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-2">
                <label htmlFor={field.name} className="sr-only">
                  パスワード
                </label>
                <InputWithIcon
                  type="password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="パスワード"
                  icon={Lock}
                  showPasswordToggle
                  isPasswordVisible={showPassword}
                  onTogglePasswordVisibility={() =>
                    setShowPassword((prev) => !prev)
                  }
                />
              </div>
            )}
          </form.Field>
          <div className="text-right">
            <a
              href="/auth/reset"
              className="text-sm text-slate-500 hover:text-slate-700 hover:underline transition-colors"
            >
              パスワードをお忘れですか?
            </a>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
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
