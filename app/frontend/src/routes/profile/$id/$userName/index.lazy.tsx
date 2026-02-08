import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import type { ProfileTab } from '@/features/profile/types'
import type React from 'react'
import {
  useFetchSelfInfoOptions,
  useFetchUserContentsOptions,
  useFetchUserFollowersOptions,
  useFetchUserInfoOptions,
} from '@/api/routes/users'
import UserOverview from '@/features/profile/components/UserOverview'
import Tab from '@/components/layout/Tab'
import FollowButton from '@/features/profile/components/FollowButton'
import ArtifactPreview from '@/components/ui/ArtifactPreview'
import ScrapPreview from '@/components/ui/ScrapPreview'
import Popover from '@/components/layout/Popover'

export const Route = createLazyFileRoute('/profile/$id/$userName/')({
  component: RouteComponent,
})

const tabLabels: Record<ProfileTab, string> = {
  artifacts: 'Artifacts',
  scraps: 'Scraps',
}

function RouteComponent() {
  const params = Route.useParams()
  const search = Route.useSearch()

  const { data: userInfo } = useSuspenseQuery(
    useFetchUserInfoOptions(params.id),
  )
  const { data: followers } = useSuspenseQuery(
    useFetchUserFollowersOptions(params.id),
  )

  const { data: contents } = useSuspenseQuery(
    useFetchUserContentsOptions(params.id, { type: search.contentsType }),
  )

  const {
    data: { id: accessUserId },
  } = useSuspenseQuery(useFetchSelfInfoOptions())

  const isFollowing = followers.some((user) => user.id === accessUserId)

  const displayContents = (): React.ReactNode => {
    if (contents === null) {
      return (
        <div className="text-center text-slate-500">
          ここにはまだ何もありません。
        </div>
      )
    }

    switch (search.contentsType) {
      case 'artifacts':
        return contents.artifacts.map((a) => (
          <ArtifactPreview
            key={a.id}
            artifact={a}
            owner={{
              id: userInfo.id,
              name: userInfo.userName,
              avatarUrl: userInfo.avatarUrl,
            }}
          />
        ))
      case 'scraps':
        return contents.scraps.map((s) => (
          <ScrapPreview
            key={s.id}
            scrap={{
              id: s.id,
              content: s.body,
              createdAt: s.createdAt.toString(),
            }}
            owner={{
              id: userInfo.id,
              name: userInfo.userName,
              avatarUrl: userInfo.avatarUrl,
            }}
          />
        ))
    }
  }

  return (
    <div className="flex flex-col gap-5 px-3 py-6 items-center">
      <UserOverview
        id={userInfo.id}
        userName={userInfo.userName}
        avatarUrl={userInfo.avatarUrl}
        bio={userInfo.bio}
        followersCount={userInfo._count.userFolloweeRelationships}
        followingCount={userInfo._count.userFollowerRelationships}
        artifactsCount={userInfo._count.artifacts}
      />
      {accessUserId !== userInfo.id && (
        <FollowButton targetUserId={userInfo.id} isFollowing={isFollowing} />
      )}
      <div className="w-full px-2 flex flex-col gap-4">
        <Tab className="w-full">
          {(['scraps', 'artifacts'] satisfies Array<ProfileTab>).map((tab) => (
            <Link
              key={tab}
              to="."
              search={(s) => ({ ...s, contentsType: tab })}
              className="w-full"
            >
              <Tab.Item
                label={tabLabels[tab]}
                isActive={search.contentsType === tab}
                className="w-full text-center"
              />
            </Link>
          ))}
        </Tab>
        <div className="flex flex-col gap-4">{displayContents()}</div>
      </div>
      <Popover>
        <Link
          to={
            search.contentsType === 'artifacts'
              ? '/timeline/artifacts/create'
              : '/timeline/scraps/create'
          }
          className="rounded-full p-2.5 bg-sky-500 flex"
        >
          <Pencil className="h-7 w-7 text-white" />
        </Link>
      </Popover>
    </div>
  )
}
