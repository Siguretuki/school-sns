import { Result } from '@praha/byethrow'
import * as argon2 from 'argon2'
import { jwt } from '../../lib/jwt.js'
import type { SignupInput, LoginInput } from '../../routes/auth/schema.js'
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

  logout: () => {
    return
  },
}
