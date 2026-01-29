# Research & Design Decisions

## Summary

- **Feature**: settings-page
- **Discovery Scope**: Extension（既存システムへの機能追加）
- **Key Findings**:
  - 既存のユーザーAPI（`/users/me` GET/PATCH）がプロフィール表示・編集に利用可能
  - 認証API（`/auth/logout` POST）が既に実装済み
  - 既存UIコンポーネント（Avatar, Button, Card）を再利用可能
  - TanStack Form + Zodパターンが既存のログインフォームで確立済み

## Research Log

### 既存API分析

- **Context**: 設定画面に必要なAPIエンドポイントの確認
- **Sources Consulted**: `app/backend/src/routes/users/index.ts`, `app/backend/src/routes/auth/index.ts`
- **Findings**:
  - `GET /users/me` - 現在のユーザー情報取得（id, userName, email, bio, avatarUrl, role, createdAt, updatedAt）
  - `PATCH /users/me` - ユーザー情報更新（userName, bio, avatarUrl）
  - `POST /auth/logout` - ログアウト（Cookie削除）
- **Implications**: 新規APIは不要、既存APIを活用

### 既存UIコンポーネント分析

- **Context**: 再利用可能なUIプリミティブの確認
- **Sources Consulted**: `app/frontend/src/components/ui/`
- **Findings**:
  - `Avatar` - 円形アバター表示（size, src, alt対応）
  - `Button` - 基本ボタン（type, onClick, disabled対応）
  - `Card` - カードコンテナ（className拡張対応）
  - `InputWithIcon` - アイコン付き入力フィールド（features/auth配下）
- **Implications**: 基本UIは再利用可能、設定固有UIのみ新規作成

### フォームパターン分析

- **Context**: プロフィール編集フォームの実装パターン
- **Sources Consulted**: `app/frontend/src/features/auth/login/hooks/useLoginForm.ts`
- **Findings**:
  - TanStack Form + Zod validatorsの組み合わせ
  - `useForm` hookによる状態管理
  - `form.Field`コンポーネントによるフィールドレンダリング
  - mutationとの統合パターン
- **Implications**: 既存パターンに従ってプロフィール編集フォームを実装

### ルーティングパターン分析

- **Context**: 設定画面のルート構成
- **Sources Consulted**: `app/frontend/src/routes/settings/index.lazy.tsx`, steering/frontend-coding.md
- **Findings**:
  - `/settings/` ルートは既にスタブ実装あり
  - `index.tsx`（loader）と`index.lazy.tsx`（UI）の分離パターン
  - `beforeLoad`での認証チェックパターン
- **Implications**: 既存ルート構造を拡張、認証ガード追加

## Architecture Pattern Evaluation

| Option        | Description                                            | Strengths                      | Risks / Limitations        | Notes  |
| ------------- | ------------------------------------------------------ | ------------------------------ | -------------------------- | ------ |
| Feature-First | `features/settings/`配下に設定固有コンポーネントを配置 | ドメイン凝集、既存パターン準拠 | なし                       | 採用   |
| Route-Only    | routesにコンポーネントを直接配置                       | シンプル                       | 再利用性低下、パターン逸脱 | 不採用 |

## Design Decisions

### Decision: Feature-First構造の採用

- **Context**: 設定画面のコンポーネント配置場所
- **Alternatives Considered**:
  1. `features/settings/`配下に配置
  2. `routes/settings/`に直接配置
- **Selected Approach**: `features/settings/`配下に配置
- **Rationale**: 既存の`features/auth/`パターンと一貫性を保つ
- **Trade-offs**: ディレクトリが増えるが、再利用性と保守性が向上
- **Follow-up**: なし

### Decision: 既存APIの活用

- **Context**: プロフィール編集・ログアウト機能のAPI
- **Alternatives Considered**:
  1. 既存APIを利用
  2. 設定専用APIを新規作成
- **Selected Approach**: 既存APIを利用
- **Rationale**: 必要な機能は既に実装済み、DRY原則
- **Trade-offs**: なし
- **Follow-up**: なし

### Decision: 通知・プライバシー設定のUI実装のみ

- **Context**: 通知設定・プライバシー設定の実装範囲
- **Alternatives Considered**:
  1. バックエンドAPIと連携した完全実装
  2. UI表示のみ（バックエンド連携は将来対応）
- **Selected Approach**: UI表示のみ、設定変更時のトースト通知
- **Rationale**: 現在のバックエンドスキーマに通知/プライバシー設定フィールドなし
- **Trade-offs**: フル機能は将来実装が必要
- **Follow-up**: バックエンドスキーマ拡張の検討

## Risks & Mitigations

- 画像アップロード機能なし — avatarUrlを直接入力する形式、または将来的にメディアAPIと統合
- 通知/プライバシー設定のバックエンド未対応 — UI実装のみ、将来拡張を想定

## References

- TanStack Form: https://tanstack.com/form/latest
- TanStack Router: https://tanstack.com/router/latest
- Material Symbols: https://fonts.google.com/icons
