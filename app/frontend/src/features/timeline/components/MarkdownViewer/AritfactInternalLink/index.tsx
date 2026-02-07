import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useFetchArtifactsDetailOptions } from '@/api/routes/artifacts'
import IconWithLabel from '@/components/ui/IconWithLabel'
import Avatar from '@/components/ui/Avatar'

interface Props {
  artifactId: string
}

const ArtifactInternalLink: React.FC<Props> = ({ artifactId }) => {
  const { data } = useSuspenseQuery(useFetchArtifactsDetailOptions(artifactId))

  return (
    <Link
      to="/timeline/artifacts/detail/$id"
      params={{ id: artifactId }}
      className="w-full rounded-xl border border-slate-800 px-2 py-5 block"
    >
      <div className="flex flex-col gap-3 text-black">
        <div className="flex items-center gap-3">
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
        </div>
        <div className="font-bold text-lg">{data.title}</div>
      </div>
    </Link>
  )
}

export default ArtifactInternalLink
