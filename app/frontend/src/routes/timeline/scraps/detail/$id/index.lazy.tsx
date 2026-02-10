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
    <div className="flex flex-col pb-20">
      <div className="flex flex-col bg-white">
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
          isLiked={false} // TODO: Fetch from API
          onLike={() => {}} // TODO: Implement mutation
          onReply={() => {}} // TODO: Navigate to reply
          likesCount={0}
          commentsCount={replies.length}
        />
      </div>

      {/* Replies Section */}
      <div className="flex flex-col">
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
              createdAt:
                (r as { createdAt?: string }).createdAt ??
                new Date().toISOString(),
              likeCount: (r as { _count?: { likes: number } })._count?.likes,
              commentCount: (r as { _count?: { scraps: number } })._count
                ?.scraps,
            }}
            className="border-x-0 border-t-0 border-b border-slate-200 rounded-none shadow-none px-4 py-3 hover:bg-slate-50 transition-colors"
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
