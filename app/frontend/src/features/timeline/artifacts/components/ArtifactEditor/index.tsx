import { Globe, Pencil } from 'lucide-react'
import { useCreateBlockNote } from '@blocknote/react'
import { ja } from '@blocknote/core/locales'
import type { useArtifactForm } from '@/features/timeline/artifacts/hooks/useArtifactForm'
import type { Tag } from '@/features/timeline/types'
import type React from 'react'
import FilterTag from '@/components/ui/FilterTag'
import Editor from '@/features/timeline/components/Editor'
import Button from '@/components/ui/Button'
import IconWithLabel from '@/components/ui/IconWithLabel'

interface Props {
  form: ReturnType<typeof useArtifactForm>['form']
  tags: Array<Tag>
}

const ArtifactEditor: React.FC<Props> = ({ form, tags }) => {
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
      className="flex flex-col gap-5 px-3 py-5"
    >
      <form.Field name="title">
        {(field) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor={field.name} className="text-lg font-medium">
              タイトル
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="Title"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="px-3 py-2 bg-slate-50 border rounded-lg"
            />
          </div>
        )}
      </form.Field>
      <div className="w-full flex flex-col gap-1">
        <div className="text-lg font-medium">Body</div>
        <form.Field name="body">
          {(field) => (
            <Editor
              id={field.name}
              initialContent={field.state.value}
              onChange={(content) => field.handleChange(content)}
              editor={bodyEditor}
              staticFormattingToolbar
              sideMenu={false}
              slashMenu={true}
              className="overflow-y-auto"
            />
          )}
        </form.Field>
      </div>
      <form.Field mode="array" name="tags">
        {(field) => (
          <div className="w-full flex flex-col gap-1">
            <label
              htmlFor={field.name}
              className="text-lg font-medium whitespace-nowrap"
            >
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
          <form.Field name="status">
            {(field) => (
              <div className="w-full flex gap-2 justify-between items-center">
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  onClick={() => field.handleChange('DRAFT')}
                  className="w-full bg-white text-black border font-medium flex items-center justify-center"
                >
                  <IconWithLabel
                    icon={() => <Pencil size={15} />}
                    label={() => '下書き保存'}
                  />
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  onClick={() => field.handleChange('PUBLISHED')}
                  className="w-full font-medium flex items-center justify-center"
                >
                  <IconWithLabel
                    icon={() => <Globe size={15} />}
                    label={() => '公開'}
                  />
                </Button>
              </div>
            )}
          </form.Field>
        )}
      </form.Subscribe>
    </form>
  )
}

export default ArtifactEditor
