import type React from 'react'
import { useGoogleLoginMutation } from '@/api/routes/auth'
import { cn } from '@/utils/cn'

interface Props {
  className?: string
}

const GoogleLoginButton: React.FC<Props> = ({ className }) => {
  const googleLoginMutation = useGoogleLoginMutation()

  return (
    <button
      type="button"
      onClick={() => googleLoginMutation.mutate()}
      disabled={googleLoginMutation.isPending}
      className={cn(
        'flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm hover:border-slate-300 hover:shadow-md transition-all',
        googleLoginMutation.isPending && 'cursor-not-allowed opacity-70',
        className,
      )}
      aria-label="Googleでログイン"
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.73 1.22 9.24 3.23l6.9-6.9C35.98 2.16 30.3 0 24 0 14.62 0 6.51 5.38 2.59 13.22l7.99 6.2C12.3 13.02 17.7 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.14 24.56c0-1.63-.15-3.2-.43-4.72H24v8.94h12.4c-.54 2.9-2.18 5.36-4.63 7.02l7.1 5.52c4.15-3.84 6.27-9.5 6.27-16.76z"
          />
          <path
            fill="#FBBC05"
            d="M10.58 28.42A14.49 14.49 0 0 1 9.5 24c0-1.54.27-3.02.75-4.42l-7.99-6.2A23.9 23.9 0 0 0 0 24c0 3.86.92 7.5 2.26 10.62l8.32-6.2z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.92-2.14 15.9-5.84l-7.1-5.52c-1.97 1.33-4.5 2.12-8.8 2.12-6.3 0-11.7-3.52-13.92-8.54l-8.32 6.2C6.4 42.66 14.82 48 24 48z"
          />
        </svg>
      </span>
      <span>Googleでログイン</span>
    </button>
  )
}

export default GoogleLoginButton
