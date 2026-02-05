import z from 'zod'
import { LocalStorageManager } from '@/utils/localStorageManager'

const searchHistorySchema = z.object({
  id: z.uuidv4().default(() => crypto.randomUUID()),
  keyword: z.string(),
  searchedAt: z.coerce.date().default(() => new Date()),
})

const searchHistoriesSchema = z.array(searchHistorySchema)

const SEARCH_HISTORIES_KEY = 'searchHistories'
const MAX_HISTORY_COUNT = 10

export type SearchHistory = z.infer<typeof searchHistorySchema>

export class SearchHistoryStorage extends LocalStorageManager<
  z.infer<typeof searchHistoriesSchema>
> {
  constructor() {
    super(SEARCH_HISTORIES_KEY, (data) =>
      searchHistoriesSchema.parse(JSON.parse(data)),
    )
  }

  getHistories() {
    return this.load() ?? []
  }

  addHistory(keyword: string) {
    const histories = this.load() ?? []
    const newHistory = searchHistorySchema.parse({ keyword })
    const updatedHistories = [
      newHistory,
      ...histories.filter((h) => h.keyword !== keyword),
    ].slice(0, MAX_HISTORY_COUNT)
    this.save(updatedHistories)
  }

  deleteHistory(id: string) {
    const histories = this.load() ?? []
    const updatedHistories = histories.filter((h) => h.id !== id)
    this.save(updatedHistories)
  }

  clearHistories() {
    this.clear()
  }

  updateSearchedAt(id: string) {
    const histories = this.load() ?? []
    const updatedHistories = histories.map((h) =>
      h.id === id ? { ...h, searchedAt: new Date() } : h,
    )
    this.save(updatedHistories)
  }
}
