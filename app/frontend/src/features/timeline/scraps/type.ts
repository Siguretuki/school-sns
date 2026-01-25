import type { FILTERS } from '@/features/timeline/scraps/constants'

type Filter = (typeof FILTERS)[number]

export type { Filter }
