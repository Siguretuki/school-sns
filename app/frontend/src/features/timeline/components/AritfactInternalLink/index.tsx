import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useFetchArtifactsDetailOptions } from '@/api/routes/artifacts'
import IconWithLabel from '@/components/ui/IconWithLabel'
import Avatar from '@/components/ui/Avatar'

interface Props {
  artifactId: string
}

const ArtifactInternalLink: React.FC<Props> = ({ artifactId }) => {
  const { data } = useSuspenseQuery(useFetchArtifactsDetailOptions(artifactId))
  const navigate = useNavigate()

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()

        navigate({
          to: '/timeline/artifacts/detail/$id',
          params: { id: artifactId },
        })
      }}
      type="button"
      className="w-full rounded-xl border border-slate-800 px-3 py-2 block"
    >
      <div className="flex flex-col items-start gap-1 text-black">
        <IconWithLabel
          icon={() => (
            <Avatar
              src={data.user.avatarUrl ?? undefined}
              alt={data.user.userName}
              className="w-6 h-6"
            />
          )}
          label={() => (
            <span className="font-bold text-md">{data.user.userName}</span>
          )}
        />
        <div className="font-bold text-lg">{data.title}</div>
      </div>
    </button>
  )
}

export default ArtifactInternalLink
