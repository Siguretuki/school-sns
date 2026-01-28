import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import InputWithIcon from '@/features/auth/components/InputWithIcon'
import { useSignupForm } from '@/features/auth/signup/hooks/useSignupForm'

const SignupForm: React.FC = () => {
  const { form, formError } = useSignupForm()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col gap-4">
          <form.Field name="email">
            {(field) => {
              const errorMessage = field.state.meta.errors[0]
              const errorText =
                typeof errorMessage === 'string'
                  ? errorMessage
                  : errorMessage?.message

              return (
                <div className="flex flex-col gap-2">
                  <label htmlFor={field.name} className="sr-only">
                    メールアドレス
                  </label>
                  <InputWithIcon
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="メールアドレス"
                    icon={Mail}
                  />
                  {errorText && (
                    <p className="text-xs text-red-500">{errorText}</p>
                  )}
                </div>
              )
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              const errorMessage = field.state.meta.errors[0]
              const errorText =
                typeof errorMessage === 'string'
                  ? errorMessage
                  : errorMessage?.message

              return (
                <div className="flex flex-col gap-2">
                  <label htmlFor={field.name} className="sr-only">
                    パスワード
                  </label>
                  <InputWithIcon
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="パスワード"
                    icon={Lock}
                    showPasswordToggle
                    isPasswordVisible={showPassword}
                    onTogglePasswordVisibility={() =>
                      setShowPassword((prev) => !prev)
                    }
                  />
                  {errorText && (
                    <p className="text-xs text-red-500">{errorText}</p>
                  )}
                </div>
              )
            }}
          </form.Field>
          <form.Field name="name">
            {(field) => {
              const errorMessage = field.state.meta.errors[0]
              const errorText =
                typeof errorMessage === 'string'
                  ? errorMessage
                  : errorMessage?.message

              return (
                <div className="flex flex-col gap-2">
                  <label htmlFor={field.name} className="sr-only">
                    表示名（任意）
                  </label>
                  <InputWithIcon
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="表示名（任意）"
                    icon={User}
                  />
                  {errorText && (
                    <p className="text-xs text-red-500">{errorText}</p>
                  )}
                </div>
              )
            }}
          </form.Field>
          {formError && (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
              >
                {isSubmitting ? '登録中...' : '新規登録'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}

export default SignupForm
