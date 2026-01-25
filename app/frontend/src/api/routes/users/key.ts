export const usersKeys = {
  all: ['users'] as const,
  me: () => [...usersKeys.all, 'me'] as const,
  lists: () => [...usersKeys.all, 'lists'] as const,
  list: (query?: Record<string, unknown>) =>
    [...usersKeys.lists(), { query }] as const,
  details: () => [...usersKeys.all, 'details'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
}
