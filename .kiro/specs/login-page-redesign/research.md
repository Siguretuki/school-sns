# Research & Design Decisions

## Summary

- **Feature**: `login-page-redesign`
- **Discovery Scope**: Extension（既存システムのUI刷新）
- **Key Findings**:
  - 既存のログインフォーム機能（認証ロジック、API連携）は完備しておりそのまま再利用可能
  - lucide-reactは既に導入済みで必要なアイコンが利用可能
  - Google OAuth2バックエンドは実装済み（`/auth/google`エンドポイント）だがフロントエンドUIが未実装
  - パスワード表示切替機能が未実装（InputWithIconコンポーネントの拡張が必要）
  - カスタムフォント（Plus Jakarta Sans / Noto Sans JP）とカラーパレット（#36454F等）は未設定

## Research Log

### Tailwind CSS v4でのカスタムカラー定義

- **Context**: 要件で指定されたカラーパレット（#36454F, #F8F8F8, #333333）をTailwindで使用する方法
- **Sources Consulted**: Tailwind CSS v4公式ドキュメント、既存styles.css
- **Findings**:
  - Tailwind v4では`@theme`ディレクティブでカスタムカラーを定義可能
  - 本プロジェクトではインラインスタイル（`bg-[#36454F]`形式）を使用するのが最も簡単
  - 既存コードはslate系カラーを使用（bg-slate-50, text-slate-800等）
- **Implications**: インライン記法で十分対応可能。テーマ拡張は不要

### Google Fontsの導入方法

- **Context**: Plus Jakarta SansとNoto Sans JPフォントの導入
- **Sources Consulted**: Google Fonts、index.html
- **Findings**:
  - 現在のindex.htmlにはGoogle Fontsリンクなし
  - `<link>` タグでpreconnect + stylesheetを追加する標準的な方法が推奨
  - styles.cssのfont-family定義を更新する必要がある
- **Implications**: index.htmlにGoogle Fontsリンクを追加し、styles.cssでfont-familyを更新

### パスワード表示切替の実装パターン

- **Context**: Eye/EyeOffアイコンによるパスワード可視性切替
- **Sources Consulted**: lucide-react、既存InputWithIconコンポーネント
- **Findings**:
  - lucide-reactには`Eye`と`EyeOff`アイコンが存在
  - 現在のInputWithIconはtype propsを受け取るがtoggle機能なし
  - React状態（useState）でpassword/textを切り替える実装が一般的
- **Implications**: InputWithIconに`showPasswordToggle` propを追加、または呼び出し側で状態管理

### 既存コンポーネント分析

- **Context**: リデザインに影響を受ける既存コンポーネントの特定
- **Sources Consulted**: codebase grep, file reads
- **Findings**:
  - `src/routes/auth/login/index.lazy.tsx`: ページレイアウト（変更対象）
  - `src/features/auth/login/components/LoginForm/index.tsx`: フォームUI（変更対象）
  - `src/features/auth/components/InputWithIcon/index.tsx`: 入力コンポーネント（拡張対象）
  - `src/components/ui/Button/index.tsx`: ボタン（カラー調整）
  - `src/components/ui/Card/index.tsx`: カード（スタイリング調整）
  - `src/components/ui/BackArrow/index.tsx`: 戻るボタン（配置調整のみ）
- **Implications**: 既存構造を維持しつつスタイリングを変更

### Google OAuth2フロントエンド導線

- **Context**: GoogleログインボタンのUI実装
- **Sources Consulted**: バックエンドauth/index.ts
- **Findings**:
  - バックエンドは`/auth/google`エンドポイントでOAuth2フローを開始
  - フロントエンドからは単純な`<a href="/api/auth/google">`でリダイレクト可能
  - Googleロゴは公式ブランドガイドラインに従う必要あり（SVG推奨）
- **Implications**: GoogleLoginButtonコンポーネントを新規作成し、リンクでバックエンドにリダイレクト

## Architecture Pattern Evaluation

| Option                    | Description                                  | Strengths                      | Risks / Limitations                         | Notes          |
| ------------------------- | -------------------------------------------- | ------------------------------ | ------------------------------------------- | -------------- |
| A: 既存コンポーネント拡張 | 既存のInputWithIcon, Button, Card等を拡張    | 変更範囲最小、既存パターン活用 | InputWithIconがパスワード固有ロジックを持つ | 推奨アプローチ |
| B: 新規コンポーネント作成 | PasswordInput, GoogleLoginButton等を新規作成 | 責務分離が明確                 | ファイル数増加、重複リスク                  | 部分的に採用   |
| C: ハイブリッド           | 汎用拡張 + 機能固有コンポーネント新規        | バランスの取れたアプローチ     | 設計判断が複雑                              | 本設計で採用   |

## Design Decisions

### Decision: InputWithIcon拡張によるパスワード表示切替

- **Context**: パスワード入力フィールドにEye/EyeOffアイコンを追加し表示切替機能を実装
- **Alternatives Considered**:
  1. InputWithIconコンポーネントに`showPasswordToggle` propを追加
  2. 新規PasswordInputコンポーネントを作成
  3. LoginForm内で直接実装（コンポーネント化しない）
- **Selected Approach**: Option 1 - InputWithIconに`showPasswordToggle`と`onTogglePassword`を追加
- **Rationale**: 既存コンポーネントの再利用性を維持しつつ、最小限の変更で機能追加可能
- **Trade-offs**: InputWithIconの責務が若干増加するが、他の認証画面（サインアップ等）でも再利用可能
- **Follow-up**: サインアップページでも同様のパターンが必要な場合に備える

### Decision: GoogleLoginButtonの新規作成

- **Context**: Googleログインボタンは既存コンポーネントで対応困難
- **Alternatives Considered**:
  1. Button コンポーネントにvariantを追加
  2. 専用のGoogleLoginButtonを新規作成
- **Selected Approach**: Option 2 - `src/components/ui/GoogleLoginButton/index.tsx`を新規作成
- **Rationale**: Googleロゴ、特有のスタイリング、OAuth導線を持つためButtonのvariantでは表現しきれない
- **Trade-offs**: ファイル数増加だが、ブランドガイドライン遵守と再利用性のバランスを取る
- **Follow-up**: サインアップページでも同じコンポーネントを再利用

### Decision: インラインカラー記法の使用

- **Context**: カスタムカラーパレット（#36454F等）の適用方法
- **Alternatives Considered**:
  1. Tailwind `@theme`でカスタムカラーを定義
  2. インライン記法（`bg-[#36454F]`）を使用
- **Selected Approach**: Option 2 - インライン記法を使用
- **Rationale**: 影響範囲がログインページに限定、テーマ全体への変更は不要
- **Trade-offs**: 色の一貫性管理はやや困難だが、今回のスコープでは許容範囲
- **Follow-up**: 将来デザインシステム整備時にテーマ定義へ移行検討

## Risks & Mitigations

- **InputWithIcon破壊的変更リスク** — 既存のprops互換性を維持し、新propsはオプショナルに
- **フォント読み込み遅延** — preconnect使用、font-display: swapで最適化
- **Googleブランドガイドライン違反** — 公式SVGロゴ使用、ガイドライン確認

## References

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) — カスタムカラー定義
- [Google Fonts](https://fonts.google.com/) — Plus Jakarta Sans, Noto Sans JP
- [lucide-react Icons](https://lucide.dev/icons/) — Eye, EyeOff, Mail, Lock, ArrowLeft, GraduationCap
- [Google Sign-In Branding Guidelines](https://developers.google.com/identity/branding-guidelines) — ボタンデザイン規約
