import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import Card from '@/components/ui/Card'
import GoogleLoginButton from '@/components/ui/GoogleLoginButton'
import LoginForm from '@/features/auth/login/components/LoginForm'
import OauthOrDivider from '@/features/auth/components/OauthOrDivider'

export const Route = createLazyFileRoute('/auth/login/')({
  component: LoginPage,
})

export function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-10 text-slate-800 overflow-hidden">
      <div className="relative flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 shadow-sm">
            <GraduationCap size={28} className="text-slate-800" />
          </span>
          <div className="flex flex-col gap-1 items-center">
            <h1 className="text-3xl font-semibold">おかえりなさい</h1>
            <p className="text-sm text-slate-500">学内コミュニティへようこそ</p>
          </div>
        </div>

        <Card className="bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-5">
            <LoginForm />
            <OauthOrDivider />
            <GoogleLoginButton />
          </div>
        </Card>

        <p className="text-center text-sm text-slate-500">
          <span>アカウントをお持ちでないですか? </span>
          <Link
            to="/auth/signup"
            className="font-semibold text-slate-800 hover:text-slate-700 transition-colors"
          >
            新規登録はこちら
          </Link>
        </p>
      </div>
    </div>
  )
}
