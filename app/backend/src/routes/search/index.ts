import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { searchService } from '../../services/search/index.js'
import { searchQuerySchema, searchResultSchema } from './schema.js'

export const search = new Hono().get(
  '/',
  describeRoute({
    tags: ['Search'],
    description: 'Search entities by keyword',
    responses: {
      200: {
        description: 'Successful Response',
        content: {
          'application/json': {
            schema: resolver(searchResultSchema),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
      },
    },
  }),
  validator('query', searchQuerySchema),
  async (c) => {
    const { keyword, type } = c.req.valid('query')
    const result = await searchService.searchByKeyword(keyword, type)

    if (result.type === 'Failure') {
      return c.json(
        { message: 'Unexpected error occurred during search.' },
        500,
      )
    }
    return c.json(result.value)
  },
)
