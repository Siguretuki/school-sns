import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  GetScrapsQuerySchema,
  PostScrapRequestBody,
  UpdateScrapRequestBody,
} from '@/api/routes/scraps/type'
import { scrapsKeys } from '@/api/routes/scraps/key'
import { apiClient } from '@/api/shared/apiClient'
import { convertQueryParams } from '@/api/shared/convertQueryParams'
import { parseApiError } from '@/api/shared/error'
import { usersKeys } from '@/api/routes/users/key'

const useFetchScrapsOptions = (query?: GetScrapsQuerySchema) =>
  queryOptions({
    queryKey: scrapsKeys.list(query),
    queryFn: async () => {
      const res = await apiClient.scraps.$get({
        query: convertQueryParams(query),
      })

      if (!res.ok) {
        return parseApiError(res)
      }
      return await res.json()
    },
  })

const useFetchScrapDetailOptions = (id: string) =>
  queryOptions({
    queryKey: scrapsKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.scraps[':scrapId'].$get({
        param: {
          scrapId: id,
        },
      })

      if (!res.ok) {
        return parseApiError(res)
      }
      return await res.json()
    },
  })

const usePostScrapMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: PostScrapRequestBody) => {
      const res = await apiClient.scraps.$post({
        json: body,
      })

      if (!res.ok) {
        return parseApiError(res)
      }
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.lists(),
      })
    },
  })
}

const useUpdateScrapMutation = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateScrapRequestBody) => {
      const res = await apiClient.scraps[':scrapId'].$patch({
        param: {
          scrapId: id,
        },
        json: body,
      })

      if (!res.ok) {
        return parseApiError(res)
      }

      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.detail(id),
      })
    },
  })
}

const useDeleteScrap = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.scraps[':scrapId'].$delete({
        param: {
          scrapId: id,
        },
      })

      if (!res.ok) {
        return parseApiError(res)
      }
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.detail(id),
      })
    },
  })
}

const useLikeScrapMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (scrapId: string) => {
      const res = await apiClient.scraps[':scrapId'].like.$post({
        param: {
          scrapId,
        },
      })

      if (!res.ok) {
        return parseApiError(res)
      }
      return await res.json()
    },
    onSuccess: (_, scrapId) => {
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.detail(scrapId),
      })
      queryClient.invalidateQueries({
        queryKey: usersKeys.details(),
      })
    },
  })
}

const useUnlikeScrapMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (scrapId: string) => {
      const res = await apiClient.scraps[':scrapId'].like.$delete({
        param: {
          scrapId,
        },
      })

      return await res.json()
    },
    onSuccess: (_, scrapId) => {
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: scrapsKeys.detail(scrapId),
      })
      queryClient.invalidateQueries({
        queryKey: usersKeys.details(),
      })
    },
  })
}

export {
  useFetchScrapsOptions,
  useFetchScrapDetailOptions,
  usePostScrapMutation,
  useUpdateScrapMutation,
  useDeleteScrap,
  useLikeScrapMutation,
  useUnlikeScrapMutation,
}
