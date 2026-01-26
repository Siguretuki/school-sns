import { createClient } from 'backend/src/createClient'

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

type FetchAPIParams = Parameters<typeof fetch>

export const apiClient = createClient(apiBaseUrl, {
  fetch: (input: FetchAPIParams[0], init: FetchAPIParams[1]) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
}).api.v2
