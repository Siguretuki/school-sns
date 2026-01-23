import ioredis from 'ioredis'
import Redis from 'ioredis-mock'

// ---------------------------------------------------------
// 型定義: IDとデータをひとまとめにする
// ---------------------------------------------------------

/**
 * セッション全体を表す型
 * @template T データ部分の型（デフォルトは Record<string, unknown>）
 */
export interface Session<T = Record<string, unknown>> {
  id: string
  data: T
}

const isTest = process.env.NODE_ENV === 'test'

// ---------------------------------------------------------
// 1. Redisクライアントの初期化
// ---------------------------------------------------------

const redisClient = new ioredis.Redis({
  host: 'redis',
  port: 6379,
  db: 0,
  keyPrefix: 'app:',

  // 接続リトライ設定（再接続の戦略）
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})
const redisMockClient = new Redis.redisMock({
  host: 'redis',
  port: 6379,
  db: 0,
  keyPrefix: 'app:',

  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

export const redis = isTest ? redisMockClient : redisClient

// ---------------------------------------------------------
// 2. セッション管理用の関数群
// ---------------------------------------------------------

/**
 * セッションを作成・保存する
 * * 変更点: 引数がバラバラではなく、Session型ひとつを受け取るようになりました
 * * @param session Sessionオブジェクト ({ id, data })
 * @param ttlSeconds 有効期限（秒）
 */
export const createSession = async <T>(
  session: Session<T>,
  ttlSeconds: number = 86400,
): Promise<void> => {
  const key = `session:${session.id}`
  // session.data を文字列化して保存
  await redis.set(key, JSON.stringify(session.data), 'EX', ttlSeconds)
}

/**
 * セッションを取得する
 * @param sessionId セッションID
 * @returns 保存されたオブジェクト または null
 */
export const getSession = async <T>(sessionId: string): Promise<T | null> => {
  const key = `session:${sessionId}`
  const rawData = await redis.get(key)

  if (!rawData) {
    return null
  }

  // 文字列をオブジェクトに戻す
  return JSON.parse(rawData) as T
}

/**
 * セッションを削除する（ログアウト時など）
 * @param sessionId セッションID
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  const key = `session:${sessionId}`
  await redis.del(key)
}

/**
 * セッションの有効期限を延長する（タッチ）
 * @param sessionId セッションID
 * @param ttlSeconds 延長する秒数
 */
export const touchSession = async (
  sessionId: string,
  ttlSeconds: number = 86400,
): Promise<boolean> => {
  const key = `session:${sessionId}`
  // expireコマンドで有効期限のみ更新 (キーが存在すれば1、なければ0が返る)
  const result = await redis.expire(key, ttlSeconds)
  return result === 1
}
