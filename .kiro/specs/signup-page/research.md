# Research & Design Decisions

---

## **Purpose**: 発見（discovery）の結果、検討したアーキテクチャ案、および`design.md`に反映する設計判断の根拠を記録する。

## Summary

- **Feature**: `signup-page`
- **Discovery Scope**: Extension
- **Key Findings**:
  - 既存のログイン画面は TanStack Router の`/auth/login/`ルートとして実装され、UIはカード中心のレイアウトと共通UI（Card/InputWithIcon/GoogleLoginButton）で構成されている。
  - フロントエンドのAPI呼び出しは `backend/src/createClient` で生成した型安全クライアント（`apiClient = createClient(...).api.v2`）を使い、Cookie（`credentials: include`）でセッションを扱う。
  - バックエンドは `/api/v2/auth/signup` を提供しており、入力スキーマは `email`, `password(min 8)`, `name(optional, max 30)` である。重複時は 409 を返す。

## Research Log

### 既存の認証UIパターン（ログイン画面の再利用可能性）

- **Context**: 「ログインページのコンポーネントを再利用してサインアップページを作成」という要件入力を具体化するため。
- **Sources Consulted**:
  - `app/frontend/src/routes/auth/login/index.lazy.tsx`
  - `app/frontend/src/features/auth/login/components/LoginForm/index.tsx`
  - `app/frontend/src/features/auth/components/InputWithIcon/index.tsx`
  - `app/frontend/src/components/ui/GoogleLoginButton/index.tsx`
- **Findings**:
  - 入力は TanStack Form + Zod で管理され、Input は `InputWithIcon` を用いる。
  - レイアウトは中心寄せ + Card を採用しており、サインアップにも同一の視覚構成が適用できる。
  - OAuth 表示の区切り（`OauthOrDivider`）や Google ボタンは共通化済み。
- **Implications**:
  - サインアップは、既存のページ骨格（ヘッダー/中央カード/フッター導線）を踏襲しつつ、フォームのみ差し替える設計が最小差分となる。

### API契約と型共有（Signup）

- **Context**: サインアップ送信・エラー処理・成功時遷移を正しく設計するため。
- **Sources Consulted**:
  - `app/backend/src/routes/auth/schema.ts`
  - `app/backend/src/routes/auth/index.ts`
  - `app/backend/src/routes/index.ts`
  - `app/frontend/src/api/shared/apiClient.ts`
  - `app/frontend/src/api/routes/auth/index.ts`
- **Findings**:
  - APIは `/api/v2/auth/signup`（POST）で、成功時は 201 を返す。
  - フロントは `ApiError`（`statusCode`付き）でHTTPエラーを表現し、TanStack Query のMutationで扱う。
  - Google認証は「ボタン押下で`window.location.assign(...)`」により開始する実装で、レスポンスJSONをUIで消費しない。
- **Implications**:
  - サインアップも login と同じMutationパターン（`useMutation` + `ApiError` + `usersKeys.me()`invalidate）で設計できる。
  - Google導線は「サインアップ向け文言」へ差し替え可能だが、開始URLは既存の`/api/v2/auth/google`を再利用できる（バックエンドが必要に応じてユーザー作成するため）。

### セキュリティ・ログ出力の注意点

- **Context**: 要件で「機微情報をログに出さない」制約があるため。
- **Sources Consulted**:
  - `app/frontend/src/features/auth/login/hooks/useLoginForm.ts`
- **Findings**:
  - ログインフォーム側に `console.log('Submitting login form with values:', value)` が存在する。
- **Implications**:
  - サインアップ実装ではパスワード等のログ出力を禁止し、設計上も「ログ出力しない」ことを契約/ガードとして明記する。
  - 既存ログインのログ出力は本仕様スコープ外だが、セキュリティ観点のリスクとして design に記録する。

## Architecture Pattern Evaluation

| Option                                             | Description                                     | Strengths                                  | Risks / Limitations                               | Notes                        |
| -------------------------------------------------- | ----------------------------------------------- | ------------------------------------------ | ------------------------------------------------- | ---------------------------- |
| 既存踏襲（Route + Page + FormHook + MutationHook） | ログインと同一の分割でサインアップを追加        | 変更が局所的、学習コスト低、テストしやすい | 既存の誤った遷移/エラー処理パターンを踏襲する恐れ | steeringのfrontend規約と整合 |
| ページ単体にロジック集約                           | ルートコンポーネントにフォーム/Mutationを直書き | 実装が速い                                 | 境界が曖昧で再利用性/テスト容易性が下がる         | 規約（hook分離）と乖離       |

## Design Decisions

### Decision: サインアップも「フォームロジックをhookへ分離」する

- **Context**: 既存のログインが `useLoginForm` を採用しており、同等の一貫性が必要。
- **Alternatives Considered**:
  1. ルートコンポーネント内にフォーム/Mutationを集約する
  2. `useSignupForm` を新設し、UIとロジックを分離する
- **Selected Approach**: `useSignupForm` を新設し、`SignupForm` コンポーネントは表示/入力に集中させる。
- **Rationale**: テストしやすく、既存のコーディング規約に従える。
- **Trade-offs**: ファイル数は増えるが、責務が明確になり長期的に保守しやすい。
- **Follow-up**: フォームのバリデーション仕様（Zodスキーマ）をバックエンドschemaと同期させる。

### Decision: SignupのAPI型は backend の zod schema から推論する

- **Context**: 型安全と契約の一貫性が要求されている。
- **Alternatives Considered**:
  1. フロント側で独自に型を定義
  2. `backend/src/routes/auth/schema` を type-only import して `z.infer` する
- **Selected Approach**: 既存loginと同様に `z.infer<typeof signupSchema>` を採用する。
- **Rationale**: 変更の単一ソース化により、バックエンド変更時の型不整合を最小化できる。
- **Trade-offs**: backend package への依存が増えるが、既に採用済みのパターン。
- **Follow-up**: `name` の任意入力・最大長をUIバリデーションへ反映する。

## Risks & Mitigations

- フォーム入力値のログ出力により機微情報が漏れるリスク — サインアップ実装ではログ出力禁止を設計に明記し、レビュー/テストで検出する
- エラー分類（409/ネットワーク/不明）でUXが悪化するリスク — `ApiError.statusCode` に基づく分岐と、再試行可能な状態維持を設計で規定する
- Google導線の文言が「ログイン」固定で混乱するリスク — サインアップページ用にラベルを切り替え可能なProps化を検討する

## References

- `.kiro/steering/frontend-coding.md` — フロントエンドの分割/規約
- `app/backend/src/routes/auth/schema.ts` — signup/login入力スキーマ
- `app/frontend/src/api/shared/apiClient.ts` — 型安全クライアントとCookie送信
