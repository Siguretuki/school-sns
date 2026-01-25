export const scrapsKeys = {
  all: ['scraps'] as const,
  lists: () => [...scrapsKeys.all, 'lists'] as const,
  list: (query?: Record<string, unknown>) =>
    [...scrapsKeys.lists(), { query }] as const,
  details: () => [...scrapsKeys.all, 'details'] as const,
  detail: (id: string) => [...scrapsKeys.details(), id] as const,
}
