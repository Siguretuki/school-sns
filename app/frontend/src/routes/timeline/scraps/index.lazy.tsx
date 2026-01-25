import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFetchScrapsOptions } from '@/api/routes/scraps'
import FilterTag from '@/components/ui/FilterTag'
import ScrapPreview from '@/features/timeline/scraps/components/ScrapPreview'
import { FILTERS, FILTER_LABELS } from '@/features/timeline/scraps/constants'

export const Route = createLazyFileRoute('/timeline/scraps/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isFollowing } = Route.useLoaderDeps()
  const { data } = useSuspenseQuery(useFetchScrapsOptions({ isFollowing }))
  const { filter } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-3 p-3 border-b border-b-slate-200 overflow-x-auto">
        {FILTERS.map((f) => (
          <FilterTag
            key={f}
            label={FILTER_LABELS[f]}
            isSelected={filter === f}
            onClick={() => {
              navigate({ search: (s) => ({ ...s, filter: f }) })
            }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 px-2 py-4">
        {data.map((d) => (
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
            }}
          />
        ))}
      </div>
    </div>
  )
}
