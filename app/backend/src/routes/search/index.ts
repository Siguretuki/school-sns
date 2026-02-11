import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { authCheck } from '../../middleware/authCheck.js'
import { searchService } from '../../services/search/index.js'
import {
  artifactSearchResultSchema,
  scrapSearchResultSchema,
  searchQuerySchema,
  tagSearchResultSchema,
  userSearchResultSchema,
} from './schema.js'

export const search = new Hono()
  .get(
    '/artifact',
    describeRoute({
      tags: ['Search'],
      description: 'Search artifacts by keyword',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(artifactSearchResultSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    validator('query', searchQuerySchema.pick({ keyword: true })),
    async (c) => {
      const { keyword } = c.req.valid('query')
      const result = await searchService.searchArtifacts(keyword)

      if (result.type === 'Failure') {
        return c.json(
          { message: 'Unexpected error occurred during search.' },
          500,
        )
      }
      return c.json(result.value)
    },
  )
  .get(
    '/scrap',
    describeRoute({
      tags: ['Search'],
      description: 'Search scraps by keyword',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(scrapSearchResultSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    authCheck,
    validator('query', searchQuerySchema.pick({ keyword: true })),
    async (c) => {
      const userId = c.var.user.userId
      const { keyword } = c.req.valid('query')
      const result = await searchService.searchScraps(keyword, userId)

      if (result.type === 'Failure') {
        return c.json(
          { message: 'Unexpected error occurred during search.' },
          500,
        )
      }
      return c.json(result.value)
    },
  )
  .get(
    '/user',
    describeRoute({
      tags: ['Search'],
      description: 'Search users by keyword',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(userSearchResultSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    validator('query', searchQuerySchema.pick({ keyword: true })),
    async (c) => {
      const { keyword } = c.req.valid('query')
      const result = await searchService.searchUsers(keyword)

      if (result.type === 'Failure') {
        return c.json(
          { message: 'Unexpected error occurred during search.' },
          500,
        )
      }
      return c.json(result.value)
    },
  )
  .get(
    '/tag',
    describeRoute({
      tags: ['Search'],
      description: 'Search tags by keyword',
      responses: {
        200: {
          description: 'Successful Response',
          content: {
            'application/json': {
              schema: resolver(tagSearchResultSchema),
            },
          },
        },
        500: {
          description: 'Internal Server Error',
        },
      },
    }),
    validator('query', searchQuerySchema.pick({ keyword: true })),
    async (c) => {
      const { keyword } = c.req.valid('query')
      const result = await searchService.searchTags(keyword)

      if (result.type === 'Failure') {
        return c.json(
          { message: 'Unexpected error occurred during search.' },
          500,
        )
      }
      return c.json(result.value)
    },
  )
