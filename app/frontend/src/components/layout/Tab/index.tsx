import TabItem from '@/components/layout/Tab/TabItem'
import { cn } from '@/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

const Tab: React.FC<Props> & { Item: typeof TabItem } = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex overflow-y-auto border-b border-slate-500 p-0 bg-slate-50 scrollbar-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}

Tab.Item = TabItem

export default Tab
