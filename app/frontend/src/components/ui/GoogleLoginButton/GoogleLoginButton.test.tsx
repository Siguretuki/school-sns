/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GoogleLoginButton from './index'

const mutateSpy = vi.fn()

vi.mock('@/api/routes/auth', () => {
  return {
    useGoogleLoginMutation: () => ({
      mutate: mutateSpy,
      isPending: false,
    }),
  }
})

describe('GoogleLoginButton', () => {
  it('triggers the Google login mutation', () => {
    render(<GoogleLoginButton />)

    fireEvent.click(screen.getByRole('button', { name: 'Googleでログイン' }))
    expect(mutateSpy).toHaveBeenCalledTimes(1)
  })
})
