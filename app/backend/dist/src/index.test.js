import { testClient } from 'hono/testing';
import { app } from './index.js';
describe('GET /demo', () => {
    it('should return correct JSON', async () => {
        // 1. 型安全なクライアントを作成
        const client = testClient(app);
        const res = await client.demo.$get();
        const json = await res.json();
        // 2. ステータスコードの検証
        expect(res.status).toBe(200);
        // 3. レスポンスボディ(JSON)の検証
        expect(json.message).toBe('This is a demo endpoint.');
    });
});
