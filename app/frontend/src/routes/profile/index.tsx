import { createFileRoute, redirect } from '@tanstack/react-router'
import { useFetchSelfInfoOptions } from '@/api/routes/users'

export const Route = createFileRoute('/profile/')({
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      const userData = await queryClient.ensureQueryData(
        useFetchSelfInfoOptions(),
      )

      throw redirect({
        to: '/profile/$id/$userName',
        params: {
          id: userData.id,
          userName: userData.userName,
        },
      })
    } catch (e) {
      // If the user is not logged in, redirect to the login page
      if (e instanceof Error) {
        throw redirect({
          to: '/auth/login',
        })
      }
      throw e
    }
  },
})
