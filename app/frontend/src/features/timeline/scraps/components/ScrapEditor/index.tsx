import { useCreateBlockNote } from '@blocknote/react'
import { ja } from '@blocknote/core/locales'
import type { useScrapForm } from '@/features/timeline/scraps/hooks/useScrapForm'
import type React from 'react'
import type { Tag } from '@/features/timeline/types'
import Button from '@/components/ui/Button'
import FilterTag from '@/components/ui/FilterTag'
import Editor from '@/features/timeline/components/Editor'

interface Props {
  form: ReturnType<typeof useScrapForm>['form']
  tags: Array<Tag>
  submitLabel?: string
}

const ScrapEditor: React.FC<Props> = ({ form, tags, submitLabel = '投稿' }) => {
  const bodyEditor = useCreateBlockNote({
    dictionary: ja,
    placeholder: 'テキストを入力してください',
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-2 min-h-full px-5 py-4 bg-slate-100"
    >
      <form.Field name="body">
        {(field) => (
          <div className="w-full flex flex-col gap-1 flex-1">
            <label htmlFor={field.name} className="text-lg font-medium">
              Body
            </label>
            <Editor
              id={field.name}
              initialContent={field.state.value}
              onChange={(content) => field.handleChange(content)}
              editor={bodyEditor}
              staticFormattingToolbar
              sideMenu={false}
              slashMenu={false}
              className="overflow-y-auto"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="tags">
        {(field) => (
          <div className="w-full flex flex-col gap-1">
            <label className="text-lg font-medium whitespace-nowrap">
              Tags
            </label>
            <div className="w-full flex overflow-x-auto gap-2 py-2 scrollbar-hidden">
              {tags.map((tag) => {
                const isSelected = field.state.value.includes(tag.id)
                return (
                  <FilterTag
                    key={tag.id}
                    label={tag.name}
                    isSelected={isSelected}
                    onClick={() =>
                      isSelected
                        ? field.removeValue(field.state.value.indexOf(tag.id))
                        : field.pushValue(tag.id)
                    }
                  />
                )
              })}
            </div>
          </div>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full"
          >
            {submitLabel}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

export default ScrapEditor
