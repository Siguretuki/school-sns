/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProfileSection from './index.tsx'

vi.mock('../ProfileEditForm', () => {
  return {
    default: () => <div>編集フォーム</div>,
  }
})

describe('ProfileSection', () => {
  const baseUser = {
    id: 'user-1',
    userName: 'Alice',
    bio: null,
    avatarUrl: null,
  }

  it('shows profile information with placeholders', () => {
    render(<ProfileSection user={baseUser} />)

    expect(screen.getByText('Alice')).toBeTruthy()
    expect(screen.getByText('自己紹介が未設定です')).toBeTruthy()
    expect(screen.getByTestId('avatar-placeholder')).toBeTruthy()
  })

  it('switches to edit mode when button is clicked', () => {
    render(<ProfileSection user={baseUser} />)

    fireEvent.click(
      screen.getAllByRole('button', { name: /プロフィールを編集/ })[0],
    )

    expect(screen.getByText('編集フォーム')).toBeTruthy()
  })
})
