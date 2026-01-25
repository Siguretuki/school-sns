import type { router } from '@/main'
import type { LinkProps } from '@tanstack/react-router'

type AppPath = LinkProps<typeof router>

export type { AppPath }
