import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import FollowUsers from '@/features/profile/components/FollowUsers'
import { useFetchUserFollowingsOptions } from '@/api/routes/users'

export const Route = createLazyFileRoute('/profile/$id/$userName/following/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { data: users } = useSuspenseQuery(
    useFetchUserFollowingsOptions(params.id),
  )

  return (
    <FollowUsers
      users={users}
      userName={params.userName}
      labelType="following"
    />
  )
}
