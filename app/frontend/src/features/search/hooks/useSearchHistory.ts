import { useState } from 'react'
import { SearchHistoryStorage } from '@/features/search/lib/searchHistoryStorage'

export const useSearchHistory = () => {
  const manager = new SearchHistoryStorage()
  const [histories, setHistories] = useState(manager.getHistories())

  const deleteHistory = (id: string) => {
    manager.deleteHistory(id)
    setHistories(manager.getHistories())
  }

  const updateHistoryTimestamp = (id: string) => {
    manager.updateSearchedAt(id)
    setHistories(manager.getHistories())
  }

  return {
    histories,
    deleteHistory,
    updateHistoryTimestamp,
  }
}
