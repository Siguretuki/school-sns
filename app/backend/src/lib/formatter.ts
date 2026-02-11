interface Tag {
  id: string
  name: string
}

interface TagArtifactsRel {
  tagArtifacts: { tag: Tag }[]
  tagScraps?: undefined
}

interface TagScrapsRel {
  tagScraps: { tag: Tag }[]
  tagArtifacts?: undefined
}
type TagRelation = TagArtifactsRel | TagScrapsRel

function toTags<T extends Record<PropertyKey, unknown>>(
  item: T & { tagArtifacts: { tag: Tag }[] },
): Omit<T, 'tagArtifacts'> & { tags: Tag[] }
function toTags<T extends Record<PropertyKey, unknown>>(
  item: T & { tagScraps: { tag: Tag }[] },
): Omit<T, 'tagScraps'> & { tags: Tag[] }
function toTags<T extends Record<PropertyKey, unknown>>(
  item: T & TagRelation,
): (Omit<T, 'tagArtifacts'> | Omit<T, 'tagScraps'>) & { tags: Tag[] } {
  if ('tagArtifacts' in item && item.tagArtifacts !== undefined) {
    const { tagArtifacts, ...rest } = item
    return {
      ...rest,
      tags: tagArtifacts.map(({ tag }) => tag),
    }
  }

  const { tagScraps, ...rest } = item
  return {
    ...rest,
    tags: tagScraps.map(({ tag }) => tag),
  }
}

const toIsLiked = <T extends Record<PropertyKey, unknown>>(
  item: T & { scrapLikes: unknown[] },
): Omit<T, 'scrapLikes'> & { isLiked: boolean } => {
  const { scrapLikes, ...rest } = item
  return {
    ...rest,
    isLiked: scrapLikes.length > 0,
  }
}

export { toTags, toIsLiked }
