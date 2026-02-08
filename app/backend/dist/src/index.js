import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { summarizePost } from './lib/langchain/index.js';
export const app = new Hono()
    .use('*', cors({
    origin: ['http://localhost:3157'],
}))
    .get('/', (c) => {
    return c.text('Hello Hono!');
})
    .get('/demo', (c) => {
    return c.json({ message: 'This is a demo endpoint.' });
})
    .get('/summarize/demo', async (c) => {
    try {
        const response = await summarizePost(`LangChainは、言語モデルを活用したアプリケーションを構築するためのフレームワークです。PythonやJavaScriptで利用でき、チャットボット、ドキュメント解析、データ生成など多様な用途に対応しています。モジュール式の設計により、カスタマイズや拡張が容易であり、オープンソースコミュニティによって積極的に開発されています。LangChainを使用することで、開発者は高度な言語処理機能を迅速に実装でき、AI駆動型アプリケーションの開発が加速します。`);
        return c.json({ summary: response.content, metadata: response });
    }
    catch (err) {
        console.error(err);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
});
export default app;
if (process.env.NODE_ENV !== 'test') {
    serve({
        fetch: app.fetch,
        port: 3000,
    }, (info) => {
        console.log(`Server running on http://localhost:${info.port.toString()}`);
    });
}
