/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { SettingsPage } from './index.lazy'

const userData = vi.hoisted(() => ({
  id: 'user-1',
  userName: 'Test User',
  bio: 'こんにちは',
  avatarUrl: 'https://example.com/avatar.png',
}))

const mutateAsync = vi.fn().mockResolvedValue({})
const logoutMutate = vi.fn()

vi.mock('@tanstack/react-router', async () => {
  const { createLazyFileRouteMock } = await import('@/testing/routerMocks')
  return {
    createLazyFileRoute: createLazyFileRouteMock(userData),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('@/api/routes/users', () => {
  return {
    useUpdateProfileMutation: () => ({ mutateAsync }),
    useFetchSelfInfoOptions: () => ({
      queryKey: ['users', 'me'],
      queryFn: vi.fn().mockResolvedValue(userData),
    }),
  }
})

vi.mock('@/api/routes/auth', () => {
  return {
    useLogoutMutation: () => ({ mutate: logoutMutate, isPending: false }),
  }
})

const renderPage = () => {
  const client = new QueryClient()
  return render(
    <QueryClientProvider client={client}>
      <SettingsPage />
    </QueryClientProvider>,
  )
}

describe('SettingsPage', () => {
  it('displays profile info and sections', async () => {
    renderPage()

    expect(await screen.findByText('Test User')).toBeTruthy()
    expect(screen.getByText('アカウント')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'ログアウト' })).toBeTruthy()
    expect(screen.getByText('v1.0.0')).toBeTruthy()
  })

  it('allows entering edit mode and opening logout dialog', async () => {
    renderPage()

    const editButtons = await screen.findAllByRole('button', {
      name: /プロフィールを編集/,
    })
    fireEvent.click(editButtons[0])
    expect(screen.getByText('保存')).toBeTruthy()

    const logoutButton = (
      await screen.findAllByRole('button', { name: 'ログアウト' })
    )[0]
    fireEvent.click(logoutButton)
    expect(screen.getByText(/ログアウトしますか/)).toBeTruthy()
  })
})
