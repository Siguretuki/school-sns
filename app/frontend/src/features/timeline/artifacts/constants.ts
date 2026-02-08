import type { ArtifactFilter } from './types'

const ARTIFACT_FILTERS = ['newest', 'popular', 'design', 'engineering'] as const

const ARTIFACT_FILTER_LABELS: Record<ArtifactFilter, string> = {
  newest: 'Newest',
  popular: 'Popular',
  design: 'Design',
  engineering: 'Engineering',
}

export { ARTIFACT_FILTERS, ARTIFACT_FILTER_LABELS }
