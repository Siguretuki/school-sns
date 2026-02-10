import { cn } from '@/utils/cn'
import Tag from '@/components/layout/StickyFilterBar/Tag'

interface Props {
  children: React.ReactNode
  className?: string
}

const StickyFilterBar: React.FC<Props> & { Tag: typeof Tag } = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'sticky top-0 z-30 flex gap-3 p-3 overflow-x-auto bg-white scrollbar-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}

StickyFilterBar.Tag = Tag

export default StickyFilterBar
