/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import LoginForm from './index'

vi.mock('@/features/auth/login/hooks/useLoginForm', () => {
  return {
    useLoginForm: () => {
      const Field = ({ name, children }: any) => {
        const [value, setValue] = useState('')
        return children({
          name,
          state: { value },
          handleChange: (next: string) => setValue(next),
        })
      }

      const Subscribe = ({ selector, children }: any) => {
        const selected = selector({ canSubmit: true, isSubmitting: false })
        return children(selected)
      }

      return {
        form: {
          handleSubmit: vi.fn(),
          Field,
          Subscribe,
        },
      }
    },
  }
})

describe('LoginForm', () => {
  it('toggles password visibility from the form state', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText('パスワード')
    expect(passwordInput.getAttribute('type')).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: 'パスワードを表示' }))

    expect(screen.getByPlaceholderText('パスワード').getAttribute('type')).toBe(
      'text',
    )
  })

  it('shows email and password placeholders', () => {
    render(<LoginForm />)

    expect(
      screen.getAllByPlaceholderText('メールアドレス').length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByPlaceholderText('パスワード').length).toBeGreaterThan(
      0,
    )
  })
})
