import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useFetchScrapsOptions } from '@/api/routes/scraps'
import ScrapPreview from '@/components/ui/ScrapPreview'
import StickyFilterBar from '@/components/layout/StickyFilterBar'
import { FILTERS, FILTER_LABELS } from '@/features/timeline/scraps/constants'
import Popover from '@/components/layout/Popover'
import NewPostButton from '@/features/timeline/components/NewPostButton'

export const Route = createLazyFileRoute('/timeline/scraps/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isFollowing } = Route.useLoaderDeps()
  const { data } = useSuspenseQuery(useFetchScrapsOptions({ isFollowing }))
  const { filter } = Route.useSearch()

  return (
    <div className="w-full">
      <StickyFilterBar>
        {FILTERS.map((f) => (
          <Link
            key={f}
            to="."
            search={(s) => ({ ...s, filter: f })}
            className="shrink-0"
          >
            <StickyFilterBar.Tag
              label={FILTER_LABELS[f]}
              isSelected={filter === f}
            />
          </Link>
        ))}
      </StickyFilterBar>
      <div className="flex flex-col gap-3 px-2 mt-3">
        {data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((d) => (
            <ScrapPreview
              key={d.id}
              owner={{
                id: d.user.id,
                avatarUrl: d.user.avatarUrl,
                name: d.user.userName,
              }}
              scrap={{
                id: d.id,
                content: d.body,
                createdAt: d.createdAt,
                commentCount: d._count.scraps,
                likeCount: 0,
              }}
              className="hover:bg-slate-50 transition-colors"
            />
          ))}
      </div>
      <Popover>
        <Link to="/timeline/scraps/create">
          <NewPostButton variant="new" />
        </Link>
      </Popover>
    </div>
  )
}
