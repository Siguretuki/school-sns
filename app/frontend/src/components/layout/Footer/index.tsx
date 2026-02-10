import { Link, useMatches } from '@tanstack/react-router'
import { LayoutGrid, MessageSquare, Search, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AppPath } from '@/types'
import { cn } from '@/utils/cn'

interface FooterItem {
  path: NonNullable<AppPath['to']>
  text: string
  icon: LucideIcon
}

const footerItems: Array<FooterItem> = [
  {
    path: '/timeline/scraps',
    text: 'Post',
    icon: MessageSquare,
  },
  {
    path: '/timeline/artifacts',
    text: 'Artifacts',
    icon: LayoutGrid,
  },
  {
    path: '/search',
    text: 'Search',
    icon: Search,
  },
  {
    path: '/profile',
    text: 'Profile',
    icon: User,
  },
]

const Footer: React.FC = () => {
  const matches = useMatches()

  return (
    <footer className="w-full h-15 bg-slate-50 flex items-center justify-between px-5 py-2 border-t border-slate-400/20">
      {footerItems.map((item) => (
        <Link
          to={item.path}
          key={item.text}
          className={cn(
            'flex flex-col items-center justify-between h-full',
            matches.some(
              (match) =>
                match.routeId.replaceAll('/', '') ===
                item.path.replaceAll('/', ''),
            )
              ? 'text-slate-800 font-bold'
              : 'text-slate-500/80',
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="text-sm">{item.text}</span>
        </Link>
      ))}
    </footer>
  )
}

export default Footer
