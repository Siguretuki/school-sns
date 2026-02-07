import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { ja } from '@blocknote/core/locales'
import { useEffect } from 'react'
import type React from 'react'
import { cn } from '@/utils/cn'
import './override.css'

interface Props {
  id?: string
  initialContent: string | null
  onChange: (content: string) => void
  className?: string
}

const Editor: React.FC<Props> = ({
  id,
  initialContent = null,
  onChange,
  className,
}) => {
  const editor = useCreateBlockNote({
    dictionary: ja,
  })

  useEffect(() => {
    if (initialContent === null) return
    const blocks = editor.tryParseMarkdownToBlocks(initialContent)
    editor.replaceBlocks(editor.document, blocks)
  }, [editor])

  const handleChange = () => {
    const content = editor.blocksToMarkdownLossy(editor.document)
    onChange(content)
  }

  return (
    <BlockNoteView
      id={id}
      editor={editor}
      onChange={handleChange}
      formattingToolbar
      theme="light"
      sideMenu
      spellCheck
      slashMenu
      linkToolbar
      className={cn('min-h-full editor', className)}
    />
  )
}

export default Editor
