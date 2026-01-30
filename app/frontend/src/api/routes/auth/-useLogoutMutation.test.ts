import { describe, expect, it, vi } from 'vitest'
import { useLogoutMutation } from './index'
import { usersKeys } from '@/api/routes/users/key'

const invalidateQueries = vi.fn()
let capturedOptions: any

vi.mock('@tanstack/react-query', () => {
  return {
    useQueryClient: () => ({ invalidateQueries }),
    useMutation: (options: any) => {
      capturedOptions = options
      return {
        mutateAsync: async (variables?: any) => {
          const result = await options.mutationFn(variables)
          if (options.onSuccess) {
            options.onSuccess(result)
          }
          return result
        },
      }
    },
  }
})

const logoutMock = vi.fn()

vi.mock('@/api/shared/apiClient', () => {
  return {
    apiClient: {
      auth: {
        logout: {
          $post: (...args: Array<any>) => logoutMock(...args),
        },
      },
    },
  }
})

describe('useLogoutMutation', () => {
  it('logs out and invalidates cache on success', async () => {
    logoutMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })

    const { mutateAsync } = useLogoutMutation()
    await mutateAsync()

    expect(logoutMock).toHaveBeenCalled()
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: usersKeys.me(),
    })
  })

  it('returns response on failure', async () => {
    logoutMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'failed' }),
    })

    useLogoutMutation()

    await expect(capturedOptions.mutationFn()).resolves.toMatchObject({
      ok: false,
      status: 500,
    })
  })
})
