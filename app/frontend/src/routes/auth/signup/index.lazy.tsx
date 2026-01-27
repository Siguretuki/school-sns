import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import Card from '@/components/ui/Card'
import GoogleLoginButton from '@/components/ui/GoogleLoginButton'
import OauthOrDivider from '@/features/auth/components/OauthOrDivider'
import SignupForm from '@/features/auth/signup/components/SignupForm'

export const Route = createLazyFileRoute('/auth/signup/')({
  component: SignupPage,
})

export function SignupPage() {
  const search = Route.useSearch()
  const oauthError =
    search.google === 'error'
      ? 'Google認証に失敗しました。もう一度お試しください。'
      : null

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-10 text-slate-800 overflow-hidden">
      <div className="relative flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400 shadow-sm">
            <GraduationCap size={28} className="text-slate-800" />
          </span>
          <div className="flex flex-col gap-1 items-center">
            <h1 className="text-3xl font-semibold">新規登録</h1>
            <p className="text-sm text-slate-500">
              学内コミュニティを始めましょう
            </p>
          </div>
        </div>

        <Card className="bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-5">
            <SignupForm />
            <OauthOrDivider />
            {oauthError && (
              <p className="text-sm text-red-600" role="alert">
                {oauthError}
              </p>
            )}
            <GoogleLoginButton label="Googleで登録" />
          </div>
        </Card>

        <p className="text-center text-sm text-slate-500">
          <span>すでにアカウントをお持ちですか? </span>
          <Link
            to="/auth/login"
            className="font-semibold text-slate-800 hover:text-slate-700 transition-colors"
          >
            ログインはこちら
          </Link>
        </p>
      </div>
    </div>
  )
}
