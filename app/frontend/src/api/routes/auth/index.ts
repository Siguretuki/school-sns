import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LoginRequestBody } from '@/api/routes/auth/type'
import { usersKeys } from '@/api/routes/users/key'
import { apiBaseUrl, apiClient } from '@/api/shared/apiClient'
import { ApiError } from '@/api/shared/error'

const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: LoginRequestBody) => {
      const res = await apiClient.auth.login.$post({ json: body })

      if (!res.ok) {
        const data = await res.json()
        if ('message' in data) {
          throw new ApiError(data.message, res.status)
        }
        throw new Error('An unknown error occurred')
      }
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: () => {
      window.location.assign(`${apiBaseUrl}/api/v2/auth/google`)
      return Promise.resolve()
    },
  })
}

export { useLoginMutation, useGoogleLoginMutation }
