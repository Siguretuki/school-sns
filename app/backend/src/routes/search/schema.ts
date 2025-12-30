import z from 'zod'
import type { SearchResult } from '../../services/search/type.js'

const searchResultEntities = (
  z.object({
    id: z.string(),
    entityName: z.string(),
  }) satisfies z.ZodType<SearchResult>
)
  .array()
  .optional()

const searchQuerySchema = z.object({
  keyword: z.string().min(1),
  type: z.enum(['artifact', 'scrap', 'user', 'tag', 'all']).default('all'),
})

const searchResultSchema = z.object({
  artifact: searchResultEntities,
  scrap: searchResultEntities,
  user: searchResultEntities,
  tag: searchResultEntities,
})

export { searchQuerySchema, searchResultSchema }
