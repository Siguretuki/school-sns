import { queryOptions } from '@tanstack/react-query'
import type { GetScrapsQuerySchema } from '@/api/routes/scraps/type'
import { scrapsKeys } from '@/api/routes/scraps/key'
import { apiClient } from '@/api/shared/apiClient'
import { convertQueryParams } from '@/api/shared/convertQueryParams'
import { ApiError } from '@/api/shared/error'

const useFetchScrapsOptions = (query?: GetScrapsQuerySchema) =>
  queryOptions({
    queryKey: scrapsKeys.list(query),
    queryFn: async () => {
      const res = await apiClient.scraps.$get({
        query: convertQueryParams(query),
      })

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

export { useFetchScrapsOptions }
