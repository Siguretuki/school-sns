export const usersKeys = {
  all: ['users'] as const,
  me: () => [...usersKeys.all, 'me'] as const,
  lists: () => [...usersKeys.all, 'lists'] as const,
  list: (query?: Record<string, unknown>) =>
    [...usersKeys.lists(), { query }] as const,
  details: () => [...usersKeys.all, 'details'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
  contents: (id: string) => [...usersKeys.detail(id), 'contents'] as const,
  content: (id: string, query?: Record<string, unknown>) =>
    [...usersKeys.contents(id), { query }] as const,
  follower: (id: string) => [...usersKeys.detail(id), 'follower'] as const,
  following: (id: string) => [...usersKeys.detail(id), 'following'] as const,
}
