import z from 'zod';
const getUserDetailResponseSchema = z.object({
    id: z.string(),
    userName: z.string(),
    email: z.string(),
    passwordHash: z.string(),
    role: z.string(),
    bio: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    createdAt: z.coerce.string(),
    updatedAt: z.coerce.string(),
});
const editUserRequestSchema = z.object({
    userName: z.string().optional(),
    bio: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
});
const userArtifactsResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    body: z.string(),
    summaryByAI: z.string().nullable(),
    status: z.string(),
    createdAt: z.coerce.string(),
    updatedAt: z.coerce.string(),
    publishedAt: z.coerce.string().nullable(),
});
export { editUserRequestSchema, getUserDetailResponseSchema, userArtifactsResponseSchema, };
