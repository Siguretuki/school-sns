import type React from 'react'
import { cn } from '@/utils/cn'

interface Props {
  icon: () => React.ReactNode
  label: string | (() => React.ReactNode)
  className?: string
  labelPosition?: 'right' | 'left' | 'top' | 'bottom'
}

const IconWithLabel: React.FC<Props> = ({
  icon: Icon,
  label,
  className,
  labelPosition = 'right',
}) => {
  const isVertical = labelPosition === 'top' || labelPosition === 'bottom'
  const isLabelFirst = labelPosition === 'left' || labelPosition === 'top'

  const renderLabel = () =>
    typeof label === 'string' ? (
      <span className="text-slate-800">{label}</span>
    ) : (
      label()
    )

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        isVertical ? 'flex-col' : 'flex-row',
        className,
      )}
    >
      {isLabelFirst && renderLabel()}
      <Icon />
      {!isLabelFirst && renderLabel()}
    </div>
  )
}

export default IconWithLabel
