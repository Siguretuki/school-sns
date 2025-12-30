type SearchType = 'artifact' | 'scrap' | 'user' | 'tag' | 'all'

interface SearchResult {
  id: string
  entityName: string
}

export type { SearchType, SearchResult }
