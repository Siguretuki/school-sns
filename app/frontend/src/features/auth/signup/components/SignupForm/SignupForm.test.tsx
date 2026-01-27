/** @vitest-environment jsdom */
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import SignupForm from './index'

const mutateAsync = vi.fn()

vi.mock('@/api/routes/auth', () => {
  return {
    useSignupMutation: () => ({
      mutateAsync,
    }),
  }
})

vi.mock('@tanstack/react-router', () => {
  return {
    useNavigate: () => vi.fn(),
  }
})

describe('SignupForm', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    mutateAsync.mockReset()
  })

  it('toggles password visibility', () => {
    render(<SignupForm />)

    const passwordInput = screen.getByPlaceholderText('パスワード')
    expect(passwordInput.getAttribute('type')).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: 'パスワードを表示' }))

    expect(screen.getByPlaceholderText('パスワード').getAttribute('type')).toBe(
      'text',
    )
  })

  it('shows validation errors for invalid inputs', async () => {
    mutateAsync.mockResolvedValueOnce(undefined)
    render(<SignupForm />)

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'invalid-email' },
    })
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'short' },
    })
    fireEvent.change(screen.getByPlaceholderText('表示名（任意）'), {
      target: { value: 'a'.repeat(31) },
    })

    fireEvent.click(screen.getByRole('button', { name: '新規登録' }))

    await waitFor(() => {
      expect(
        screen.getByText('メールアドレスの形式が正しくありません'),
      ).toBeTruthy()
      expect(
        screen.getByText('パスワードは8文字以上で入力してください'),
      ).toBeTruthy()
      expect(
        screen.getByText('表示名は30文字以内で入力してください'),
      ).toBeTruthy()
    })

    expect(mutateAsync).not.toHaveBeenCalled()
  })

  it('disables submit while submitting', async () => {
    mutateAsync.mockReturnValueOnce(new Promise(() => {}))
    render(<SignupForm />)

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: '新規登録' }))

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: '登録中...' })
      expect((submitButton as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
