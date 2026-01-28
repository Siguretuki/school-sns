/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SignupPage } from './index.lazy'

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
    useNavigate: () => vi.fn(),
  }
})

vi.mock('@/features/auth/signup/components/SignupForm', () => {
  return {
    default: () => <div>SignupForm</div>,
  }
})

vi.mock('@/components/ui/GoogleLoginButton', () => {
  return {
    default: () => <button type="button">Googleで登録</button>,
  }
})

describe('SignupPage', () => {
  it('renders branding and links', () => {
    render(<SignupPage />)

    expect(screen.getByText('新規登録')).toBeTruthy()
    expect(screen.getByText('学内コミュニティを始めましょう')).toBeTruthy()

    expect(screen.getByRole('button', { name: 'Googleで登録' })).toBeTruthy()

    const loginLink = screen.getByRole('link', { name: 'ログインはこちら' })
    expect(loginLink.getAttribute('href')).toBe('/auth/login')
  })
})
