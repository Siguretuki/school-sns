import type { Filter } from '@/features/timeline/scraps/type'

const FILTERS = ['all', 'following'] as const

const FILTER_LABELS: Record<Filter, string> = {
  all: '全て',
  following: 'フォロー中',
}
export { FILTERS, FILTER_LABELS }
