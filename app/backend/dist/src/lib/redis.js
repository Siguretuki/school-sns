import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
const isTest = process.env.NODE_ENV === 'test';
// ---------------------------------------------------------
// 1. Redisクライアントの初期化
// ---------------------------------------------------------
const redisClient = new Redis({
    host: 'redis',
    port: 6379,
    db: 0,
    keyPrefix: 'app:',
    // 接続リトライ設定（再接続の戦略）
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const redisMockClient = new RedisMock({
    // このRedisはコンスラクト可能ではないと言われるがコンストラクタです。
    host: 'redis',
    port: 6379,
    db: 0,
    keyPrefix: 'app:',
}); // Redis-mock自体がデフォルトでコンストラクタらしいからRedisを返せます
export const redis = isTest ? redisMockClient : redisClient;
// ---------------------------------------------------------
// 2. セッション管理用の関数群
// ---------------------------------------------------------
/**
 * セッションを作成・保存する
 * * 変更点: 引数がバラバラではなく、Session型ひとつを受け取るようになりました
 * * @param session Sessionオブジェクト ({ id, data })
 * @param ttlSeconds 有効期限（秒）
 */
export const createSession = async (session, ttlSeconds = 86400) => {
    const key = `session:${session.id}`;
    // session.data を文字列化して保存
    await redis.set(key, JSON.stringify(session.data), 'EX', ttlSeconds);
};
/**
 * セッションを取得する
 * 戻り値を T ではなく Session<T> に変更しました
 * @param sessionId セッションID
 * @returns Sessionオブジェクト ({ id, data }) または null
 */
export const getSession = async (sessionId) => {
    const key = `session:${sessionId}`;
    const rawData = await redis.get(key);
    if (!rawData) {
        return null;
    }
    // 保存されているのは data 部分のみなので、
    // 取得時に id と組み合わせて Session<T> の形に復元する
    const data = JSON.parse(rawData);
    return {
        id: sessionId,
        data: data,
    };
};
/**
 * セッションを削除する（ログアウト時など）
 * @param sessionId セッションID
 */
export const deleteSession = async (sessionId) => {
    const key = `session:${sessionId}`;
    await redis.del(key);
};
/**
 * セッションの有効期限を延長する（タッチ）
 * @param sessionId セッションID
 * @param ttlSeconds 延長する秒数
 */
export const touchSession = async (sessionId, ttlSeconds = 86400) => {
    const key = `session:${sessionId}`;
    // expireコマンドで有効期限のみ更新 (キーが存在すれば1、なければ0が返る)
    const result = await redis.expire(key, ttlSeconds);
    return result === 1;
};
