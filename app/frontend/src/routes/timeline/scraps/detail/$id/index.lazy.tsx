import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useFetchScrapDetailOptions } from '@/api/routes/scraps'
import ScrapPreview from '@/components/ui/ScrapPreview'
import Actions from '@/features/timeline/scraps/detail/components/Actions'
import ScrapDetail from '@/features/timeline/scraps/detail/components/ScrapDetail'
import Popover from '@/components/layout/Popover'
import NewPostButton from '@/features/timeline/components/NewPostButton'
import { useFetchSelfInfoOptions } from '@/api/routes/users'

export const Route = createLazyFileRoute('/timeline/scraps/detail/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const {
    data: { id: userId },
  } = useSuspenseQuery(useFetchSelfInfoOptions())
  const {
    data: { scraps: replies, ...rootScrap },
  } = useSuspenseQuery(useFetchScrapDetailOptions(params.id))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col border-y-slate-800 bg-slate-100/70">
        <ScrapDetail
          owner={{
            id: rootScrap.user.id,
            avatarUrl: rootScrap.user.avatarUrl,
            name: rootScrap.user.userName,
          }}
          scrap={{
            id: rootScrap.id,
            title: rootScrap.title,
            body: rootScrap.body,
            createdAt: rootScrap.createdAt,
            updatedAt: rootScrap.updatedAt,
          }}
          isEditable={userId === rootScrap.user.id}
        />
        <Actions
          likesCount={0}
          commentsCount={replies.length}
          targetId={rootScrap.id}
        />
      </div>
      <div className="flex flex-col gap-3 px-2">
        {replies.map((r) => (
          <ScrapPreview
            key={r.id}
            owner={{
              id: r.user.id,
              avatarUrl: r.user.avatarUrl,
              name: r.user.userName,
            }}
            scrap={{
              id: r.id,
              content: r.body,
              createdAt: r.createdAt,
              commentCount: 0,
              likeCount: 0,
            }}
            className="hover:bg-slate-50 transition-colors"
          />
        ))}
      </div>
      <Popover>
        <Link to="/timeline/scraps/create" search={{ replyTo: params.id }}>
          <NewPostButton variant="reply" />
        </Link>
      </Popover>
    </div>
  )
}
