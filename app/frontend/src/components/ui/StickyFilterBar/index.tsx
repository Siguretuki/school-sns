import FilterTag from '@/components/ui/FilterTag'

interface Props<T extends string> {
  items: ReadonlyArray<T>
  selected: T
  onSelect: (item: T) => void
  getLabel: (item: T) => string
  className?: string
}

const StickyFilterBar = <T extends string>({
  items,
  selected,
  onSelect,
  getLabel,
  className,
}: Props<T>) => {
  return (
    <>
      <div className="h-[55px] w-full shrink-0" />
      <div
        className={`fixed top-[3.75rem] left-0 right-0 z-30 flex gap-3 p-3 overflow-x-auto bg-white scrollbar-hidden ${className || ''}`}
      >
        {items.map((item) => (
          <FilterTag
            key={item}
            label={getLabel(item)}
            isSelected={selected === item}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    </>
  )
}

export default StickyFilterBar
