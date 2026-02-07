import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './override.css'
import { cn } from '@/utils/cn'
import ArtifactInternalLink from '@/features/timeline/components/MarkdownViewer/AritfactInternalLink'

interface Props {
  mdSource: string
  className?: string
}

const MarkdownViewer: React.FC<Props> = ({ mdSource, className }) => {
  return (
    <div className={cn('markdown flex flex-col gap-3', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // pの中にdiv吐くので置き換え
          p: ({ children }) => <div className="my-0">{children}</div>,
          a: (arg) => {
            const { href } = arg
            const artifactInternalLink =
              href && href.startsWith('/timeline/artifacts')
                ? href.split('/')[3].replaceAll('/', '').trim()
                : null

            return artifactInternalLink !== null ? (
              <ArtifactInternalLink artifactId={artifactInternalLink} />
            ) : (
              <a {...arg} target="_blank" rel="noopener noreferrer" />
            )
          },
        }}
      >
        {mdSource}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownViewer
