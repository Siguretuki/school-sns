import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { FormattingToolbar, useCreateBlockNote } from '@blocknote/react'
import { ja } from '@blocknote/core/locales'
import { useEffect } from 'react'
import type React from 'react'
import type { BlockNoteEditor } from '@blocknote/core'
import { cn } from '@/utils/cn'
import './override.css'

interface Props {
  id?: string
  initialContent: string | null
  onChange: (content: string) => void
  className?: string
  editor?: BlockNoteEditor
  formattingToolbar?: boolean
  staticFormattingToolbar?: boolean
  sideMenu?: boolean
  slashMenu?: boolean
}

const Editor: React.FC<Props> = ({
  id,
  initialContent = null,
  onChange,
  className,
  editor: externalEditor,
  formattingToolbar = true,
  staticFormattingToolbar = false,
  sideMenu = true,
  slashMenu = true,
}) => {
  const internalEditor = useCreateBlockNote({
    dictionary: ja,
  })

  const editor = externalEditor || internalEditor

  useEffect(() => {
    if (initialContent === null) return
    const blocks = editor.tryParseMarkdownToBlocks(initialContent)
    editor.replaceBlocks(editor.document, blocks)
  }, [editor, initialContent])

  const handleChange = () => {
    const content = editor.blocksToMarkdownLossy(editor.document)
    onChange(content)
  }

  return (
    <BlockNoteView
      id={id}
      editor={editor}
      onChange={handleChange}
      formattingToolbar={staticFormattingToolbar ? false : formattingToolbar}
      theme="light"
      sideMenu={sideMenu}
      spellCheck
      slashMenu={slashMenu}
      linkToolbar
      className={cn('min-h-full editor', className)}
    >
      {staticFormattingToolbar ? <FormattingToolbar /> : null}
    </BlockNoteView>
  )
}

export default Editor
