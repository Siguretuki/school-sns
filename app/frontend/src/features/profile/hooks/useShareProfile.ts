import { useCallback } from 'react'

export const useShareProfile = (userName: string) => {
  return useCallback(async () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    const shareApi = (
      navigator as {
        share?: (data: ShareData) => Promise<void>
      }
    ).share
    const clipboardApi = (navigator as { clipboard?: Clipboard }).clipboard

    const copyWithFallback = async () => {
      if (clipboardApi) {
        await clipboardApi.writeText(url)
        return true
      }

      if (typeof document === 'undefined') return false
      const textArea = document.createElement('textarea')
      textArea.value = url
      textArea.setAttribute('readonly', 'true')
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(textArea)
      return copied
    }

    try {
      if (shareApi) {
        await shareApi({
          title: `${userName}のプロフィール`,
          url,
        })
        return
      }

      if (await copyWithFallback()) {
        return
      }
    } catch {
      // Ignore share errors and keep UI quiet.
    }

    if (typeof window !== 'undefined') {
      window.prompt('URLをコピーしてください', url)
    }
  }, [userName])
}
