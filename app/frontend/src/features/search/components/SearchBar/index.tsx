import { useEffect } from 'react'
import SearchInput from '@/components/ui/SearchInput'
import { useSearchForm } from '@/features/search/hooks/useSearchForm'

interface Props {
  placeholder?: string
  keyword: string | null
}

const SearchBar: React.FC<Props> = ({
  placeholder = '投稿、タグ、ユーザーを検索',
  keyword,
}) => {
  const { form } = useSearchForm({ keyword })

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
              onChange={(val) => field.handleChange(val === '' ? null : val)}
              onClear={() => field.handleChange(null)}
              placeholder={placeholder}
              containerClassName="flex-1"
            />
          )}
        </form.Field>
      </form>
    </div>
  )
}

export default SearchBar
