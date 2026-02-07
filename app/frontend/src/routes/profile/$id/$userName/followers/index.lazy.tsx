import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFetchUserFollowersOptions } from '@/api/routes/users'
import FollowUsers from '@/features/profile/components/FollowUsers'

export const Route = createLazyFileRoute('/profile/$id/$userName/followers/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { data: users } = useSuspenseQuery(
    useFetchUserFollowersOptions(params.id),
  )

  return (
    <FollowUsers
      users={users}
      userName={params.userName}
      labelType="followers"
    />
  )
}
