import z from 'zod';
const tagSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    createdAt: z.coerce.string(),
    updatedAt: z.coerce.string(),
});
const getTagsQuerySchema = z
    .object({
    artifactId: z.string().optional(),
    scrapId: z.string().optional(),
})
    .optional();
const addTagSchema = z.object({
    name: z.string(),
    slug: z.string().nullable().default(null),
});
const updateTagSchema = z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
});
export { addTagSchema, getTagsQuerySchema, tagSchema, updateTagSchema };
