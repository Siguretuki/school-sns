import { Link, createLazyFileRoute } from '@tanstack/react-router'
import SearchHistory from '@/features/search/components/SearchHistory'
import { useSearchHistory } from '@/features/search/hooks/useSearchHistory'

export const Route = createLazyFileRoute('/search/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { histories, deleteHistory, updateHistoryTimestamp } =
    useSearchHistory()

  return (
    <div className="flex flex-col gap-2 w-full">
      {histories
        .sort((a, b) => b.searchedAt.getTime() - a.searchedAt.getTime())
        .map((history) => (
          <Link
            key={history.id}
            to="/search/result"
            search={{ keyword: history.keyword }}
            onClick={() => updateHistoryTimestamp(history.id)}
          >
            <SearchHistory
              keyword={history.keyword}
              onDelete={() => deleteHistory(history.id)}
            />
          </Link>
        ))}
    </div>
  )
}
