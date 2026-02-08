import { z } from 'zod';
// サインアップ用のバリデーション
const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().max(30).optional(),
});
// ログイン用のバリデーション
const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
});
// ユーザー情報の型（パスワードを含まない）
const userResponseSchema = z.object({
    id: z.uuid({ version: 'v4' }),
    userName: z.string(),
    email: z.email(),
    role: z.string(),
    bio: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ログイン成功時のレスポンス
const authResponseSchema = z.object({
    token: z.string(),
    user: userResponseSchema,
});
const googleLoginInputSchema = z.object({
    googleId: z.string(),
    email: z.email(),
    name: z.string().nullable(),
    picture: z.string().nullable(),
});
const googleTokenSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
});
export { signupSchema, loginSchema, authResponseSchema, googleLoginInputSchema, googleTokenSchema, };
