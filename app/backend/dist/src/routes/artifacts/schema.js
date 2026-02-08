import z from 'zod';
const artifactSchema = z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    body: z.string(),
    summaryByAI: z.string(),
    status: z.string(),
    createdAt: z.coerce.string(),
    updatedAt: z.coerce.string(),
    publishedAt: z.coerce.string(),
});
const getArtifactsQuerySchema = z
    .object({
    isFollowing: z
        .preprocess((val) => val === 'true', z.boolean())
        .optional()
        .default(false),
    tagIds: z
        .preprocess((val) => (typeof val === 'string' ? [val] : val), z.array(z.string()))
        .optional(),
    limit: z.coerce.number().min(1).optional(),
    page: z.coerce.number().min(1).optional(),
})
    .optional();
const registerArtifactSchema = z.object({
    title: z.string().min(1),
    body: z.string(),
    status: z.enum(['DRAFT', 'PUBLISHED']),
    tagIds: z.array(z.string()).optional(),
});
const updateArtifactSchema = z.object({
    title: z.string().min(1).optional(),
    body: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    tagIds: z.array(z.string()).optional(),
});
export { artifactSchema, getArtifactsQuerySchema, registerArtifactSchema, updateArtifactSchema, };
