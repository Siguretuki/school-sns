import { UserRole } from '../../lib/enum.js';
import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { cleanupDatabase } from '../../testing/setup.js';
import { authRepository } from './repository.js';
describe('AuthRepository', () => {
    const repo = authRepository;
    beforeEach(async () => {
        await cleanupDatabase(); // これだけで全リセット完了
    });
    describe('createUser', () => {
        it('AUTH_REPO_001: 正しい入力値でユーザーが作成されること', async () => {
            const input = {
                email: 'test@example.com',
                name: 'Test User',
                passwordHash: 'hashed_pw',
            };
            const user = await repo.createUser({
                ...input,
                password: 'pw',
            });
            expect(user).toEqual(expect.objectContaining({
                email: input.email,
                userName: input.name,
                passwordHash: input.passwordHash,
                role: UserRole.STUDENT,
            }));
        });
        it('AUTH_REPO_002: 名前が未指定の場合に No Name が設定されること', async () => {
            const input = {
                email: 'noname@example.com',
                name: undefined,
                passwordHash: 'hashed_pw',
            };
            const user = await repo.createUser({ ...input, password: 'pw' });
            expect(user.userName).toBe('No Name');
        });
        it('AUTH_REPO_003: 既に存在するEmailで登録した際にエラーが発生すること', async () => {
            const email = 'duplicate@example.com';
            // 1人目を作成（Emailだけ固定）
            await createTestUser({ email });
            // 同じEmailで2人目を作成
            await expect(repo.createUser({
                email,
                name: 'New User',
                passwordHash: 'new_hash',
                password: '',
            })).rejects.toThrow();
        });
        it('AUTH_REPO_004: 必須項目(email)が欠落している場合にエラーが発生すること', async () => {
            await expect(repo.createUser({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
                email: null,
                name: 'No Email User',
                passwordHash: 'hash',
                password: '',
            })).rejects.toThrow();
        });
    });
    describe('findByEmail', () => {
        it('AUTH_REPO_005: 存在するEmailを指定してユーザーが取得できること', async () => {
            const email = 'find@example.com';
            const createdUser = await createTestUser({ email });
            const foundUser = await repo.findByEmail(email);
            expect(foundUser?.id).toBe(createdUser.id);
        });
        it('AUTH_REPO_006: 存在しないEmailを指定した際に null が返ること', async () => {
            const foundUser = await repo.findByEmail('notfound@example.com');
            expect(foundUser).toBeNull();
        });
    });
    describe('Google OAuth Methods', () => {
        const mockGoogleId = '12345678901234567890';
        const mockGoogleInput = {
            googleId: mockGoogleId,
            email: 'google-user@example.com',
            name: 'Google User',
            picture: 'https://example.com/avatar.png',
        };
        describe('findByGoogleId', () => {
            it('AUTH_REPO_007: 存在するGoogle IDを指定してユーザーが取得できること', async () => {
                await prisma.users.create({
                    data: {
                        email: mockGoogleInput.email,
                        userName: mockGoogleInput.name,
                        googleId: mockGoogleId,
                        avatarUrl: mockGoogleInput.picture,
                        passwordHash: '',
                    },
                });
                const foundUser = await repo.findByGoogleId(mockGoogleId);
                expect(foundUser?.googleId).toBe(mockGoogleId);
            });
            it('AUTH_REPO_008: 存在しないGoogle IDを指定した際に null が返ること', async () => {
                const foundUser = await repo.findByGoogleId('non-existent-id');
                expect(foundUser).toBeNull();
            });
        });
        describe('updateGoogleId', () => {
            it('AUTH_REPO_009: 既存のユーザーにGoogle IDを紐付けられること', async () => {
                // 引数なしでランダムなユーザーを作成
                const existingUser = await createTestUser();
                const updatedUser = await repo.updateGoogleId(existingUser.id, mockGoogleId);
                expect(updatedUser.googleId).toBe(mockGoogleId);
            });
        });
        describe('createWithGoogle', () => {
            it('AUTH_REPO_010: Google情報から新しくユーザーが作成されること', async () => {
                const user = await repo.createWithGoogle(mockGoogleInput);
                expect(user.googleId).toBe(mockGoogleInput.googleId);
                expect(user.email).toBe(mockGoogleInput.email);
            });
            it('AUTH_REPO_011: 名前が欠落している場合でも No Name で作成されること', async () => {
                const inputWithoutName = {
                    ...mockGoogleInput,
                    name: undefined,
                    googleId: 'other-id',
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const user = await repo.createWithGoogle(inputWithoutName);
                expect(user.userName).toBe('No Name');
            });
        });
    });
});
