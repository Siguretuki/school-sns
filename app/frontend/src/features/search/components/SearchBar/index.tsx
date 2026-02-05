import { FileText, LayoutGrid } from 'lucide-react'
import { useEffect, useState } from 'react'
import FilterTag from '@/components/ui/FilterTag'
import SearchInput from '@/components/ui/SearchInput'
import { useSearchForm } from '@/features/search/hooks/useSearchForm'

interface Props {
  placeholder?: string
  keyword: string | null
}

const TABS = [
  { label: 'すべて' },
  { label: 'ユーザー' },
  { label: 'タグ' },
  { label: 'Artifacts', icon: <LayoutGrid className="w-4 h-4" /> },
  { label: 'Scraps', icon: <FileText className="w-4 h-4" /> },
]

const SearchBar: React.FC<Props> = ({
  placeholder = '投稿、タグ、ユーザーを検索',
  keyword,
}) => {
  const { form } = useSearchForm({ keyword })
  const [selectedTab, setSelectedTab] = useState('すべて')

  useEffect(() => {
    form.setFieldValue('keyword', keyword)
  }, [keyword])
  
  return (
    <div className="flex flex-col gap-2 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex w-full gap-2 items-center"
      >
        <form.Field name="keyword">
          {(field) => (
            <SearchInput
              value={field.state.value ?? ''}
              onChange={(val) =>
                field.handleChange(val === '' ? null : val)
              }
              onClear={() => field.handleChange(null)}
              placeholder={placeholder}
              containerClassName="flex-1"
            />
          )}
        </form.Field>
      </form>

      <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
        {TABS.map((tab) => (
          <FilterTag
            key={tab.label}
            label={tab.label}
            icon={tab.icon}
            isSelected={selectedTab === tab.label}
            onClick={() => setSelectedTab(tab.label)}
            className="whitespace-nowrap"
          />
        ))}
      </div>
    </div>
  )
}

export default SearchBar
