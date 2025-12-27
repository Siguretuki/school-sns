import * as argon2 from 'argon2'
import { HTTPException } from 'hono/http-exception'
import { sign } from 'hono/jwt'
import type { SignupInput, LoginInput } from '../../routes/auth/schema.js'
import { authRepository } from './repository.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'it-is-very-secret'
const TOKEN_EXPIRATION_SEC =
  Number(process.env.TOKEN_EXPIRATION_SEC) || 60 * 60 * 24

/**
 * JWT生成の共通関数
 * SignupとLoginの両方で使用します
 */
const generateJwt = async (user: { id: string; role: string }) => {
  const payload = {
    sub: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SEC,
  }
  return await sign(payload, JWT_SECRET)
}

export class AuthError extends Error {}

export class EmailAlreadyExistsError extends AuthError {
  constructor() {
    super('Email already exists')
    this.name = 'EmailAlreadyExistsError'
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export const authService = {
  /**
   * 新規登録
   */
  signup: async (input: SignupInput) => {
    // 1. 重複チェック
    const existingUser = await authRepository.findByEmail(input.email)
    if (existingUser) {
      throw new EmailAlreadyExistsError()
    }

    // 2. ハッシュ化
    const passwordHash = await argon2.hash(input.password)

    // 3. ユーザー作成
    const user = await authRepository.createUser({ ...input, passwordHash })

    // 4. JWT生成 (共通関数を使用)
    const token = await generateJwt(user)

    // 5. UserResponse型に変換して返却
    return {
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
    }
  },
  /**
   * ログイン
   */
  login: async (input: LoginInput) => {
    // 1. ユーザー取得
    const user = await authRepository.findByEmail(input.email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    // 2. パスワード検証
    const isValidPassword = await argon2.verify(
      user.passwordHash,
      input.password,
    )

    if (!isValidPassword) {
      throw new InvalidCredentialsError()
    }

    // 3. ★JWT生成 (共通関数を使用)
    const token = await generateJwt(user)

    // 4. UserResponse型に変換して返却
    return {
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
    }
  },

  logout: () => {
    return
  },
}
