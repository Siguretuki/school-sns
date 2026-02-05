import { Outlet, createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import SearchBar from '@/features/search/components/SearchBar'

const searchParamsSchema = z.object({
  keyword: z.string().nullable().default(null),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { keyword } = Route.useSearch()

  return (
    <div className="flex flex-col gap-2 w-full items-center px-2 py-2 bg-slate-50">
      <SearchBar keyword={keyword} />
      <Outlet />
    </div>
  )
}
