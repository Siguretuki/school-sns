/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LoginPage } from './index.lazy'

vi.mock('@tanstack/react-router', () => {
  return {
    Link: ({ to, children, ...rest }: any) => {
      const href = typeof to === 'string' ? to : to?.to
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      )
    },
    createLazyFileRoute: () => (options: any) => options,
  }
})

vi.mock('@/features/auth/login/components/LoginForm', () => {
  return {
    default: () => <div>LoginForm</div>,
  }
})

vi.mock('@/components/ui/GoogleLoginButton', () => {
  return {
    default: () => <button type="button">Googleでログイン</button>,
  }
})

describe('LoginPage', () => {
  it('renders branding and links', () => {
    render(<LoginPage />)

    expect(screen.getByText('おかえりなさい')).toBeTruthy()
    expect(screen.getByText('学内コミュニティへようこそ')).toBeTruthy()

    expect(
      screen.getByRole('button', { name: 'Googleでログイン' }),
    ).toBeTruthy()

    const signupLink = screen.getByRole('link', { name: '新規登録はこちら' })
    expect(signupLink.getAttribute('href')).toBe('/auth/signup')
  })
})
