# Project Structure

## Organization Philosophy

**モノレポ + ドメイン分割**: Backend/Frontendを独立パッケージとして管理し、各パッケージ内はドメイン（機能）単位でディレクトリを構成。

## Directory Patterns

### Root Level

```
/
├── app/
│   ├── backend/     # APIサーバー
│   └── frontend/    # SPAクライアント
├── docs/            # ドキュメント
└── .kiro/           # プロジェクトメモリ（steering, specs）
```

### Backend (`app/backend/`)

**Purpose**: Hono APIサーバー、Prisma DB

| Path                     | Purpose                               |
| ------------------------ | ------------------------------------- |
| `src/routes/{domain}/`   | APIエンドポイント定義（Honoルーター） |
| `src/services/{domain}/` | ビジネスロジック層                    |
| `src/lib/`               | 共通ユーティリティ（JWT, Redis等）    |
| `src/middleware/`        | 認証等のミドルウェア                  |
| `prisma/`                | スキーマ、マイグレーション            |
| `generated/prisma/`      | Prisma生成コード（自動生成）          |

**Service Layer Pattern**:

```typescript
// services/{domain}/service.ts - ビジネスロジック
// services/{domain}/repository.ts - データアクセス
// services/{domain}/error.ts - ドメイン固有エラー
```

### Frontend (`app/frontend/`)

**Purpose**: React SPA、TanStack Router

| Path                       | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| `src/routes/`              | ファイルベースルーティング（TanStack Router） |
| `src/features/{domain}/`   | ドメイン固有のコンポーネント・ロジック        |
| `src/components/ui/`       | 再利用可能なUIプリミティブ                    |
| `src/components/layout/`   | レイアウトコンポーネント（Header, Footer）    |
| `src/api/routes/{domain}/` | API呼び出しhooks（TanStack Query）            |
| `src/api/shared/`          | APIクライアント、共通エラー型                 |
| `src/integrations/`        | 外部ライブラリ統合                            |

## Naming Conventions

- **Files**: kebab-case（例: `auth-cookie.ts`）
- **Components**: PascalCase（例: `Header.tsx`）
- **Functions/Variables**: camelCase
- **Types/Interfaces**: PascalCase（例: `ApiError`）
- **Constants**: UPPER_SNAKE_CASE

## Import Organization

```typescript
// Backend - 相対パス + .js拡張子（ESM）
import {jwt} from "../../lib/jwt.js";
import type {SignupInput} from "../../routes/auth/schema.js";

// Frontend - @/エイリアス
import {apiClient} from "@/api/shared/apiClient";
import Header from "@/components/layout/Header/index";
```

**Path Aliases**:

- Frontend: `@/` → `src/`

## Code Organization Principles

- **ドメイン単位の凝集**: 関連コードは同一ドメインフォルダに配置
- **Routes ↔ Services分離**: ルーティング層とビジネスロジック層の明確な境界
- **型の共有**: BackendのAppTypeをFrontendでimportしてAPIクライアントを型安全に
- **自動生成コードの分離**: `generated/`や`routeTree.gen.ts`はgit管理下だがバージョン管理のみ

---

_created_at: 2026-01-26_
