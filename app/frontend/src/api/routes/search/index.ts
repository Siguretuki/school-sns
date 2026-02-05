import type { SearchType } from 'backend/src/services/search/type'
import { apiClient } from '@/api/shared/apiClient'
import { ApiError } from '@/api/shared/error'

const invokeSearch = async (
  keyword: string,
  type: Exclude<SearchType, 'all'>,
) => {
  switch (type) {
    case 'user': {
      const res = await apiClient.search.user.$get({
        query: { keyword },
      })

      if (res.ok) {
        return {
          type,
          result: await res.json(),
        }
      }
      break
    }
    case 'scrap': {
      const res = await apiClient.search.scrap.$get({
        query: { keyword },
      })

      if (res.ok) {
        return {
          type,
          result: await res.json(),
        }
      }
      break
    }
    case 'artifact': {
      const res = await apiClient.search.artifact.$get({
        query: { keyword },
      })

      if (res.ok) {
        return {
          type,
          result: await res.json(),
        }
      }
      break
    }
    case 'tag': {
      const res = await apiClient.search.tag.$get({
        query: { keyword },
      })

      if (res.ok) {
        return {
          type,
          result: await res.json(),
        }
      }
      break
    }
  }

  throw new ApiError('Search request failed', 500)
}

export { invokeSearch }
