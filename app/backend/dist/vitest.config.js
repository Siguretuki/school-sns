import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        name: 'backend',
        environment: 'node',
        globals: true,
        include: ['src/**/*.test.ts'],
        fileParallelism: false,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
        },
        env: {
            NODE_ENV: 'test',
        },
    },
});
