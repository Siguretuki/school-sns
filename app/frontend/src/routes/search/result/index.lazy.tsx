import { Link, createLazyFileRoute } from '@tanstack/react-router'
import type { SearchType } from '@/features/search/types'
import type React from 'react'
import ArtifactPreview from '@/components/ui/ArtifactPreview'
import ScrapPreview from '@/components/ui/ScrapPreview'
import UserPreview from '@/components/ui/UserPreview'
import TagPreview from '@/components/ui/TagPreview'
import Tab from '@/components/layout/Tab'

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

  const resultView = ((): React.ReactNode => {
    if (data.result.length === 0) {
      return (
        <div className="p-8 text-center text-slate-500">
          検索結果が見つかりませんでした。
        </div>
      )
    }

    switch (data.type) {
      case 'artifact':
        return data.result.map((a) => (
          <ArtifactPreview
            key={a.id}
            artifact={a}
            owner={{
              id: a.userId,
              name: a.user.userName,
              avatarUrl: a.user.avatarUrl,
            }}
          />
        ))
      case 'scrap':
        return data.result.map((s) => (
          <ScrapPreview
            key={s.id}
            scrap={{
              id: s.id,
              content: s.body,
              createdAt: (s as any).createdAt ?? new Date().toISOString(),
              likeCount: (s as any)._count?.likes,
              commentCount: (s as any)._count?.scraps,
            }}
            owner={{
              id: s.userId,
              name: s.user.userName,
              avatarUrl: s.user.avatarUrl,
            }}
          />
        ))
      case 'user':
        return data.result.map((u) => (
          <UserPreview
            key={u.id}
            id={u.id}
            name={u.userName}
            avatarUrl={u.avatarUrl}
          />
        ))
      case 'tag':
        return data.result.map((t) => (
          <TagPreview key={t.id} id={t.id} label={t.name} />
        ))
    }
  })()

  return (
    <div className="flex flex-col gap-4 w-full">
      <Tab>
        {(['scrap', 'artifact', 'user', 'tag'] satisfies Array<SearchType>).map(
          (type) => (
            <Link key={type} to="." search={(s) => ({ ...s, type })}>
              <Tab.Item
                label={TAB_LABELS[type]}
                isActive={data.type === type}
              />
            </Link>
          ),
        )}
      </Tab>
      {resultView}
    </div>
  )
}
