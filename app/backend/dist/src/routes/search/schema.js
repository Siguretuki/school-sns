import z from 'zod';
const searchResultEntities = z.object({
    id: z.string(),
    entityName: z.string(),
})
    .array()
    .optional();
const searchQuerySchema = z.object({
    keyword: z.string().min(1),
    type: z.enum(['artifact', 'scrap', 'user', 'tag', 'all']).default('all'),
});
const searchResultSchema = z.object({
    artifact: searchResultEntities,
    scrap: searchResultEntities,
    user: searchResultEntities,
    tag: searchResultEntities,
});
const userSearchResultSchema = z.object({
    id: z.string(),
    userName: z.string(),
    avatarUrl: z.string(),
});
const tagSearchResultSchema = z.object({
    id: z.string(),
    name: z.string(),
});
const scrapSearchResultSchema = z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    author: z.object({
        userName: z.string(),
        avatarUrl: z.string(),
    }),
});
const artifactSearchResultSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.object({
        userName: z.string(),
        avatarUrl: z.string(),
    }),
});
export { searchQuerySchema, searchResultSchema, userSearchResultSchema, tagSearchResultSchema, scrapSearchResultSchema, artifactSearchResultSchema, };
