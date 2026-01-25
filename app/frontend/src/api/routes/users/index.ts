import { queryOptions } from '@tanstack/react-query'
import { usersKeys } from '@/api/routes/users/key'
import { apiClient } from '@/api/shared/apiClient'
import { ApiError } from '@/api/shared/error'

const useFetchSelfInfoOptions = () =>
  queryOptions({
    queryKey: usersKeys.me(),
    queryFn: async () => {
      const res = await apiClient.users.me.$get()

      if (!res.ok) {
        const data = await res.json()
        if ('message' in data) {
          throw new ApiError(data.message, res.status)
        }
        throw new ApiError('An unknown error occurred', res.status)
      }
      return await res.json()
    },
  })

export { useFetchSelfInfoOptions }
