import { describe, expect, it, vi } from 'vitest'
import { useSignupMutation } from './index'
import { usersKeys } from '@/api/routes/users/key'

const invalidateQueries = vi.fn()
let capturedOptions: any

vi.mock('@tanstack/react-query', () => {
  return {
    useQueryClient: () => ({ invalidateQueries }),
    useMutation: (options: any) => {
      capturedOptions = options
      return {
        mutateAsync: vi.fn(),
        isPending: false,
      }
    },
  }
})

describe('useSignupMutation', () => {
  it('invalidates the current user query on success', () => {
    useSignupMutation()

    capturedOptions.onSuccess()

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: usersKeys.me(),
    })
  })
})
