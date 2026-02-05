import { Link, createLazyFileRoute } from '@tanstack/react-router'
import type { SearchType } from '@/features/search/types'
import TabItem from '@/features/search/result/components/TabItem'
import UserResult from '@/features/search/result/components/UserResult'
import ArtifactResult from '@/features/search/result/components/ArtifactResult'
import ScrapResult from '@/features/search/result/components/ScrapResult'
import TagResult from '@/features/search/result/components/TagResult'

export const Route = createLazyFileRoute('/search/result/')({
  component: RouteComponent,
})

const TAB_LABELS: Record<SearchType, string> = {
  artifact: 'アーティファクト',
  scrap: 'スクラップ',
  user: 'ユーザー',
  tag: 'タグ',
}

function RouteComponent() {
  const data = Route.useLoaderData()

  const resultView = (() => {
    switch (data.type) {
      case 'artifact':
        return (
          <ArtifactResult
            artifacts={data.result.map((r) => ({
              ...r,
              author: {
                userName: r.user.userName,
                avatarUrl: r.user.avatarUrl,
              },
            }))}
          />
        )
      case 'scrap':
        return (
          <ScrapResult
            scraps={data.result.map((r) => ({
              ...r,
              author: {
                userName: r.user.userName,
                avatarUrl: r.user.avatarUrl,
              },
            }))}
          />
        )
      case 'user':
        return <UserResult users={data.result} />
      case 'tag':
        return <TagResult tags={data.result} />
    }
  })()

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex overflow-y-auto border-b border-slate-500 p-0 bg-slate-50 scrollbar-hidden">
        {(['scrap', 'artifact', 'user', 'tag'] satisfies Array<SearchType>).map(
          (type) => (
            <Link key={type} to="." search={(s) => ({ ...s, type })}>
              <TabItem label={TAB_LABELS[type]} isActive={data.type === type} />
            </Link>
          ),
        )}
      </div>
      {resultView}
    </div>
  )
}
