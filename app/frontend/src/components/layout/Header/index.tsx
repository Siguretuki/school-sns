import { Link, useMatch, useMatches } from '@tanstack/react-router'

import type { AppPath } from '@/types'
import BackArrow from '@/components/ui/BackArrow'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'

type TitlePath = Extract<
  NonNullable<AppPath['to']>,
  | '/auth/login'
  | '/auth/signup'
  | '/timeline/artifacts'
  | '/settings'
  | '/search'
>

interface PathWithTitle {
  path: TitlePath
  title: string
}

const HeaderTitles: Array<PathWithTitle> = [
  { path: '/auth/login', title: 'ログイン' },
  { path: '/auth/signup', title: '新規登録' },
  { path: '/timeline/artifacts', title: '記事' },
  { path: '/settings', title: '設定' },
  { path: '/search', title: '検索' },
]

export default function Header() {
  const matches = useMatches()
  const isScrapsPage =
    useMatch({
      from: '/timeline/scraps/',
      shouldThrow: false,
    }) !== undefined
  const loginMatch = useMatch({
    from: '/auth/login/',
    shouldThrow: false,
  })
  const signupMatch = useMatch({
    from: '/auth/signup/',
    shouldThrow: false,
  })
  const isAuthPage = (loginMatch ?? signupMatch) !== undefined
  
  const searchMatch = useMatch({
    from: '/search',
    shouldThrow: false,
  })
  const isSearchPage = searchMatch !== undefined

  if (isSearchPage) return null

  const currentTitle = HeaderTitles.find((item) =>
    matches.some(
      (match) =>
        match.routeId.replaceAll('/', '') === item.path.replaceAll('/', ''),
    ),
  )

  return (
    <header
      className={cn(
        'bg-slate-50 px-2 py-2 flex items-center shadow h-15 overflow-y-clip',
        isAuthPage ? 'justify-center' : 'justify-between',
      )}
    >
      {!isScrapsPage && !isAuthPage && <BackArrow />}
      <h1 className="font-bold text-lg">
        {currentTitle !== undefined ? currentTitle.title : 'Campus Link'}
      </h1>
      {!isAuthPage && (
        <Link to="/settings" aria-label="設定へ移動">
          <Avatar className="h-full py-1" />
        </Link>
      )}
    </header>
  )
}
