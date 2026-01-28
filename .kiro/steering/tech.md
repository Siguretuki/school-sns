# Technology Stack

## Architecture

モノレポ構成でBackend（API）とFrontend（SPA）を分離。型安全なクライアント共有により、エンドツーエンドの型整合性を実現。

## Core Technologies

- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm 10.25.0 (workspace)
- **Runtime**: Node.js 20+

### Backend

- **Framework**: Hono（軽量Web framework）
- **ORM**: Prisma（SQLite）
- **認証**: JWT + argon2、OAuth2（Google）
- **エラーハンドリング**: @praha/byethrow（Result型）
- **AI統合**: LangChain + Google Generative AI

### Frontend

- **Framework**: React 19
- **Routing**: TanStack Router（型安全ルーティング）
- **State/Data**: TanStack Query（サーバー状態管理）
- **Styling**: Tailwind CSS v4
- **Build**: Vite

## Key Libraries

| 役割       | Backend             | Frontend            |
| ---------- | ------------------- | ------------------- |
| API        | Hono + hono-openapi | TanStack Query      |
| 型共有     | hc (hono/client)    | createClient import |
| Validation | Zod                 | Zod                 |
| Form       | -                   | TanStack Form       |

## Development Standards

### Type Safety

- TypeScript strict mode 有効
- `any` 禁止、明示的な型定義推奨
- Prismaの生成型を活用

### Code Quality

- ESLint + Prettier 統一設定
- lint-staged + husky でコミット時チェック

### Testing

- Vitest（Backend/Frontend共通）
- Backend: リポジトリ層のユニットテスト

## Development Environment

### Required Tools

- Node.js 20+
- pnpm 10.25.0（Corepackで管理推奨）
- Docker（devcontainer利用時）

### Common Commands

```bash
# Dev（両方同時起動）
pnpm dev

# Build
pnpm build

# Lint/Format
pnpm lint && pnpm format
pnpm check  # 両方実行

# Backend固有
pnpm --filter ./app/backend prisma:mig  # マイグレーション
pnpm --filter ./app/backend prisma:gen  # クライアント生成
pnpm --filter ./app/backend prisma:std  # Prisma Studio
```

## Key Technical Decisions

- **Honoの採用**: 軽量・高速・型安全なAPIフレームワーク
- **hc型共有**: BackendのAPI型をFrontendで直接利用
- **Result型パターン**: 明示的なエラーハンドリング（byethrow）
- **TanStack系統一**: Router/Query/Formの一貫した開発体験
- **SQLite**: シンプルなセットアップ、Prisma経由で抽象化

---

_created_at: 2026-01-26_
