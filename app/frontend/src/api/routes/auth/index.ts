import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  LoginRequestBody,
  SignupRequestBody,
} from '@/api/routes/auth/type'
import { usersKeys } from '@/api/routes/users/key'
import { apiBaseUrl, apiClient } from '@/api/shared/apiClient'
import { parseApiError } from '@/api/shared/error'

const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: LoginRequestBody) => {
      const res = await apiClient.auth.login.$post({ json: body })
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

const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: () => {
      window.location.assign(`${apiBaseUrl}/api/v2/auth/google`)
      return Promise.resolve()
    },
  })
}

const useSignupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: SignupRequestBody) => {
      const res = await apiClient.auth.signup.$post({ json: body })
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

const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // ログアウトAPIは200を返すだけなので、特にレスポンスを処理しない
      return await apiClient.auth.logout.$post()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

export {
  useLoginMutation,
  useGoogleLoginMutation,
  useSignupMutation,
  useLogoutMutation,
}
