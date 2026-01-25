import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import Card from '@/components/ui/Card'
import LoginForm from '@/features/auth/login/components/LoginForm'

export const Route = createLazyFileRoute('/auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <div className="flex flex-col gap-5 items-center">
        <span className="p-3 bg-slate-300/70 w-fit h-fit rounded-3xl">
          <GraduationCap size={45} className="text-slate-800" />
        </span>
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-bold text-4xl">おかえりなさい</h2>
          <p className="text-md">学内コミュニティにようこそ</p>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <Card className="h-fit m-auto bg-slate-50">
          <LoginForm />
        </Card>
      </div>
      <div>
        <p className="text-sm text-slate-500 flex gap-1 flex-wrap justify-center">
          <span>アカウントをお持ちでないですか?</span>
          <Link to="/auth/signup" className="font-bold text-slate-800">
            新規登録はこちら
          </Link>
        </p>
      </div>
    </div>
  )
}
