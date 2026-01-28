import type React from 'react'

interface Props {}

const OauthOrDivider: React.FC<Props> = () => {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-400">
      <span className="h-px flex-1 bg-slate-200" />
      <span>または</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  )
}

export default OauthOrDivider
