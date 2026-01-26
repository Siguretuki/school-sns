/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'
import { LockKeyhole } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import InputWithIcon from './index'

describe('InputWithIcon', () => {
  it('renders a password toggle button and switches type', () => {
    const handleToggle = vi.fn()
    const { rerender } = render(
      <InputWithIcon
        type="password"
        id="password"
        name="password"
        value=""
        onChange={() => {}}
        placeholder="パスワード"
        icon={LockKeyhole}
        showPasswordToggle
        isPasswordVisible={false}
        onTogglePasswordVisibility={handleToggle}
      />,
    )

    const input = screen.getByPlaceholderText('パスワード')
    expect(input.getAttribute('type')).toBe('password')

    const toggleButton = screen.getByRole('button', {
      name: 'パスワードを表示',
    })
    fireEvent.click(toggleButton)
    expect(handleToggle).toHaveBeenCalledTimes(1)

    rerender(
      <InputWithIcon
        type="password"
        id="password"
        name="password"
        value=""
        onChange={() => {}}
        placeholder="パスワード"
        icon={LockKeyhole}
        showPasswordToggle
        isPasswordVisible
        onTogglePasswordVisibility={handleToggle}
      />,
    )

    expect(screen.getByPlaceholderText('パスワード').getAttribute('type')).toBe(
      'text',
    )
    expect(
      screen.getByRole('button', { name: 'パスワードを隠す' }),
    ).toBeTruthy()
  })
})
