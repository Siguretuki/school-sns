import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  FetchUserContentsQuerySchema,
  UpdateUserRequestSchema,
} from '@/api/routes/users/type'
import { usersKeys } from '@/api/routes/users/key'
import { apiClient } from '@/api/shared/apiClient'
import { parseApiError } from '@/api/shared/error'

const useFetchSelfInfoOptions = () =>
  queryOptions({
    queryKey: usersKeys.me(),
    queryFn: async () => {
      const res = await apiClient.users.me.$get()
      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
  })

const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateUserRequestSchema) => {
      const res = await apiClient.users.me.$patch({ json: body })
      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

const useFetchUserContentsOptions = (
  userId: string,
  query?: FetchUserContentsQuerySchema,
) =>
  queryOptions({
    queryKey: usersKeys.content(userId, query),
    queryFn: async () => {
      const res = await apiClient.users[':userId'].contents.$get({
        param: { userId },
        query,
      })

      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
  })

const useFetchUserInfoOptions = (userId: string) =>
  queryOptions({
    queryKey: usersKeys.detail(userId),
    queryFn: async () => {
      const res = await apiClient.users[':userId'].$get({ param: { userId } })

      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
  })

const useFollowUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await apiClient.users[':userId'].follow.$post({
        param: { userId: targetUserId },
      })

      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.detail(targetUserId),
      })
    },
  })
}

const useUnfollowUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await apiClient.users[':userId'].follow.$delete({
        param: { userId: targetUserId },
      })

      return await res.json()
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.detail(targetUserId),
      })
    },
  })
}

const useFetchUserFollowersOptions = (userId: string) =>
  queryOptions({
    queryKey: usersKeys.follower(userId),
    queryFn: async () => {
      const res = await apiClient.users[':userId'].followers.$get({
        param: { userId },
      })

      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
  })

const useFetchUserFollowingsOptions = (userId: string) =>
  queryOptions({
    queryKey: usersKeys.following(userId),
    queryFn: async () => {
      const res = await apiClient.users[':userId'].following.$get({
        param: { userId },
      })

      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
  })

export {
  useFetchUserInfoOptions,
  useFetchSelfInfoOptions,
  useUpdateProfileMutation,
  useFetchUserContentsOptions,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useFetchUserFollowersOptions,
  useFetchUserFollowingsOptions,
}
