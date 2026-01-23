import { Result } from '@praha/byethrow'
import * as argon2 from 'argon2'
import { jwt } from '../../lib/jwt.js'
import type {
  SignupInput,
  LoginInput,
  GoogleLoginInput,
} from '../../routes/auth/schema.js'
import { EmailAlreadyExistsError, InvalidCredentialsError } from './error.js'
import { authRepository } from './repository.js'

export const authService = {
  /**
   * 新規登録
   */
  signup: async (input: SignupInput) => {
    // 1. 重複チェック
    const existingUser = await authRepository.findByEmail(input.email)
    if (existingUser) {
      return Result.fail(new EmailAlreadyExistsError())
    }

    // 2. ハッシュ化
    const passwordHash = await argon2.hash(input.password)

    // 3. ユーザー作成
    const user = await authRepository.createUser({ ...input, passwordHash })

    // 4. JWT生成 (共通関数を使用)
    const token = await jwt.generate({
      id: user.id,
      role: user.role,
    })

    // 5. UserResponse型に変換して返却
    return Result.succeed({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  },
  /**
   * ログイン
   */
  login: async (input: LoginInput) => {
    // 1. ユーザー取得
    const user = await authRepository.findByEmail(input.email)

    if (!user) {
      return Result.fail(new InvalidCredentialsError())
    }

    // 2. パスワード検証
    if (!user.passwordHash) {
      return Result.fail(new InvalidCredentialsError())
    }

    const isValidPassword = await argon2.verify(
      user.passwordHash,
      input.password,
    )

    if (!isValidPassword) {
      return Result.fail(new InvalidCredentialsError())
    }

    // 3. ★JWT生成 (共通関数を使用)
    const token = await jwt.generate({
      id: user.id,
      role: user.role,
    })

    // 4. UserResponse型に変換して返却
    return Result.succeed({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  },

  /**
   * Google認証（ログイン・新規登録兼用）
   */
  loginWithGoogle: async (input: GoogleLoginInput) => {
    // 0. バリデーション: Googleからの情報に必須項目があるか確認
    // (Googleのスコープ設定によってはemailが取れない場合があるため予測してfailする)
    if (!input.email) {
      return Result.fail(
        new Error('Google account does not have an email address.'),
      )
    }

    // --------------------------------------------------
    // パターンA: すでにGoogle連携済みのユーザーがいる場合
    // --------------------------------------------------
    const linkedUser = await authRepository.findByGoogleId(input.googleId)

    if (linkedUser) {
      return Result.succeed({
        user: {
          id: linkedUser.id,
          userName: linkedUser.userName,
          email: linkedUser.email,
          role: linkedUser.role,
          bio: linkedUser.bio,
          avatarUrl: linkedUser.avatarUrl,
          createdAt: linkedUser.createdAt,
          updatedAt: linkedUser.updatedAt,
        },
      })
    }

    // --------------------------------------------------
    // パターンB: Google連携はしていないが、同じメアドのユーザーがいる場合
    // (既存アカウントへの紐付け処理)
    // --------------------------------------------------
    const existingEmailUser = await authRepository.findByEmail(input.email)

    if (existingEmailUser) {
      // 既存ユーザーにGoogle IDを上書き(紐付け)する
      const updatedUser = await authRepository.updateGoogleId(
        existingEmailUser.id,
        input.googleId,
      )

      return Result.succeed({
        user: {
          id: updatedUser.id,
          userName: updatedUser.userName,
          email: updatedUser.email,
          role: updatedUser.role,
          bio: updatedUser.bio,
          avatarUrl: updatedUser.avatarUrl,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      })
    }

    // --------------------------------------------------
    // パターンC: 完全な新規ユーザーの場合
    // --------------------------------------------------
    const newUser = await authRepository.createWithGoogle({
      googleId: input.googleId,
      email: input.email,
      name: input.name ?? 'No Name',
      picture: input.picture,
    })

    return Result.succeed({
      user: {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
        bio: newUser.bio,
        avatarUrl: newUser.avatarUrl,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    })
  },

  logout: () => {
    return
  },
}
