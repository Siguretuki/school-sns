import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFetchArtifactsDetailOptions } from '@/api/routes/artifacts'
import { useFetchSelfInfoOptions } from '@/api/routes/users'
import ContentHeader from '@/components/ui/ContentHeader'
import MetaInfo from '@/components/ui/MetaInfo'
import UserCard from '@/components/ui/UserCard'
import AISummary from '@/features/timeline/artifacts/detail/components/AISummary'
import MarkdownViewer from '@/features/timeline/components/MarkdownViewer'

export const Route = createLazyFileRoute('/timeline/artifacts/detail/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { data } = useSuspenseQuery(useFetchArtifactsDetailOptions(params.id))
  const {
    data: { id: currentUserId },
  } = useSuspenseQuery(useFetchSelfInfoOptions())

  const isOwner = currentUserId === data.user.id

  return (
    <div className="flex justify-center w-full px-2 py-2">
      <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col px-6 md:px-10 py-6 gap-6 w-full">
          <ContentHeader
            title={data.title}
            artifactId={data.id}
            isOwner={isOwner}
          />

          <MetaInfo publishedAt={data.publishedAt} />

          <UserCard
            userId={data.user.id}
            userName={data.user.userName}
            avatarUrl={data.user.avatarUrl}
          />

          {data.summaryByAI && <AISummary summary={data.summaryByAI} />}

          <div className="mt-2">
            <MarkdownViewer
              mdSource={data.body}
              className="text-lg text-slate-800 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
