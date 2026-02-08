import * as argon2 from 'argon2';
import { prisma } from '../../lib/prisma.js';
import { createTestUser } from '../../testing/factories.js';
import { cleanupDatabase } from '../../testing/setup.js';
import { EmailAlreadyExistsError, InvalidCredentialsError } from './error.js';
import { authService } from './service.js';
describe('AuthService', () => {
    // テスト実行ごとにデータベースをクリーンアップ
    beforeEach(async () => {
        await cleanupDatabase();
    });
    describe('signup', () => {
        const signupInput = {
            email: 'signup@example.com',
            name: 'Signup User',
            password: 'password123',
        };
        // 正常な入力値でユーザー登録が完了するか検証
        it('AUTH_SERVICE_001: 正しい入力値でユーザー登録が成功し変換されたユーザー情報が返ること', async () => {
            const result = await authService.signup(signupInput);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.user.email).toBe(signupInput.email);
                expect(result.value.user.userName).toBe(signupInput.name);
                expect(result.value.user).not.toHaveProperty('passwordHash');
            }
        });
        // 既に登録されたメールアドレスでの登録が拒否されるか検証
        it('AUTH_SERVICE_002: 既に登録済みのメールアドレスで登録しようとした場合にEmailAlreadyExistsErrorが返ること', async () => {
            // 重複エラー用にあえて同じメールアドレスで作成
            await createTestUser({ email: signupInput.email });
            const result = await authService.signup(signupInput);
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(EmailAlreadyExistsError);
            }
        });
        // パスワードが生文ではなくハッシュ化されてDBに保存されているか検証
        it('AUTH_SERVICE_003: パスワードが正しくハッシュ化されて保存されること', async () => {
            await authService.signup(signupInput);
            const userInDb = await prisma.users.findUnique({
                where: { email: signupInput.email },
            });
            if (!userInDb?.passwordHash) {
                throw new Error('User not found or password hash is missing');
            }
            // if文を通過したので、ここは ! 無しでも string 型として認識される
            expect(userInDb.passwordHash).not.toBe(signupInput.password);
            const isPasswordValid = await argon2.verify(userInDb.passwordHash, signupInput.password);
            expect(isPasswordValid).toBe(true);
        });
    });
    describe('login', () => {
        const password = 'correct_password';
        // 正しい認証情報でのログイン成功を検証
        it('AUTH_SERVICE_004: 正しいメールアドレスとパスワードでログインが成功すること', async () => {
            // ランダムなEmailを持つユーザーを作成
            const user = await createTestUser({ password });
            const result = await authService.login({
                email: user.email,
                password: password,
            });
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.user.id).toBe(user.id);
            }
        });
        // 登録されていないメールアドレスでのログイン失敗を検証
        it('AUTH_SERVICE_005: 存在しないメールアドレスでログインした際にInvalidCredentialsErrorが返ること', async () => {
            const result = await authService.login({
                email: 'notfound@example.com',
                password: 'any_password',
            });
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(InvalidCredentialsError);
            }
        });
        // 誤ったパスワードでのログイン失敗を検証
        it('AUTH_SERVICE_006: パスワードが一致しない場合にInvalidCredentialsErrorが返ること', async () => {
            const user = await createTestUser({ password });
            const result = await authService.login({
                email: user.email,
                password: 'wrong_password',
            });
            expect(result.type).toBe('Failure');
        });
        // パスワードを持たないユーザー（Google連携のみ等）のログイン制御を検証
        it('AUTH_SERVICE_007: パスワード未設定のユーザー(Google専用)がパスワードログインを試みた場合にエラーになること', async () => {
            // Googleログイン等で作成された、passwordHashを持たないユーザーを想定
            // Factoryで password: '' や null を渡せるか不明なため、直接Prismaで作成
            const noPasswordUser = await prisma.users.create({
                data: {
                    email: 'nopass@example.com',
                    userName: 'No Pass User',
                    passwordHash: '', // または null (スキーマ定義による)
                },
            });
            const result = await authService.login({
                email: noPasswordUser.email,
                password: 'any_password',
            });
            expect(result.type).toBe('Failure');
            if (result.type === 'Failure') {
                expect(result.error).toBeInstanceOf(InvalidCredentialsError);
            }
        });
    });
    describe('loginWithGoogle', () => {
        const googleInput = {
            googleId: 'google-id-123',
            email: 'google@example.com',
            name: 'Google User',
            picture: 'https://example.com/photo.png',
        };
        // プロバイダからメールアドレスが提供されなかった場合のエラー処理を検証
        it('AUTH_SERVICE_008: Googleアカウントにメールアドレスが含まれない場合にエラーが返ること', async () => {
            const result = await authService.loginWithGoogle({
                ...googleInput,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
                email: undefined,
            });
            expect(result.type).toBe('Failure');
        });
        // 既に連携済みのユーザーが正常にログインできるか検証
        it('AUTH_SERVICE_009: 既にGoogle連携済みのユーザーがGoogleログインに成功すること', async () => {
            // 事前にGoogle ID紐付け済みのユーザーを作成
            await prisma.users.create({
                data: {
                    email: googleInput.email,
                    userName: googleInput.name,
                    googleId: googleInput.googleId,
                    passwordHash: '',
                },
            });
            const result = await authService.loginWithGoogle(googleInput);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.user.email).toBe(googleInput.email);
            }
        });
        // 既存のEmailユーザーに対し、Google IDを後から紐付けてログインできるか検証
        it('AUTH_SERVICE_010: Google連携はしていないが同一メールアドレスの既存ユーザーがいる場合に連携処理が行われること', async () => {
            // 既存のEmailユーザーを作成（Google IDなし）
            const existingUser = await createTestUser({ email: googleInput.email });
            expect(existingUser.googleId).toBeNull();
            const result = await authService.loginWithGoogle(googleInput);
            expect(result.type).toBe('Success');
            // DBを確認して紐付けが行われたかチェック
            const userInDb = await prisma.users.findUnique({
                where: { id: existingUser.id },
            });
            expect(userInDb?.googleId).toBe(googleInput.googleId);
        });
        // 新規ユーザーが自動的に作成されるか検証
        it('AUTH_SERVICE_011: 全くの新規ユーザーがGoogleログインした際に新しくアカウントが作成されること', async () => {
            const result = await authService.loginWithGoogle(googleInput);
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.user.email).toBe(googleInput.email);
            }
            const userInDb = await prisma.users.findUnique({
                where: { email: googleInput.email },
            });
            expect(userInDb?.googleId).toBe(googleInput.googleId);
        });
        // 名前情報がない場合のデフォルト値設定を検証
        it('AUTH_SERVICE_012: Googleログインで名前が提供されない場合にNo Nameとして登録されること', async () => {
            const result = await authService.loginWithGoogle({
                ...googleInput,
                name: null,
            });
            expect(result.type).toBe('Success');
            if (result.type === 'Success') {
                expect(result.value.user.userName).toBe('No Name');
            }
        });
    });
});
