# Implementation Plan

## Task 1. フォント・スタイリング基盤の準備

- [x] 1.1 (P) Google Fontsの導入
  - index.htmlにGoogle Fonts（Plus Jakarta Sans, Noto Sans JP）のpreconnectとstylesheetリンクを追加
  - styles.cssのfont-familyを更新してカスタムフォントを優先適用
  - _Requirements: 2.6, 8.3_

## Task 2. 汎用UIコンポーネントの拡張・新規作成

- [x] 2.1 (P) InputWithIconコンポーネントのパスワード表示切替対応
  - 新しいプロパティ（showPasswordToggle, isPasswordVisible, onTogglePasswordVisibility）を追加
  - パスワード表示切替時にEye/EyeOffアイコンを右側に表示する機能を実装
  - type属性をisPasswordVisibleに基づいてpassword/textで切り替え
  - 既存propsの後方互換性を維持
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2.2 (P) GoogleLoginButtonコンポーネントの新規作成
  - Googleブランドガイドラインに準拠したボタンデザインを実装
  - 白背景、ボーダー、GoogleロゴSVGを配置
  - `/api/auth/google`へのリンクとしてナビゲーション機能を実装
  - cn()ユーティリティでクラス拡張に対応
  - _Requirements: 6.2, 6.3_

## Task 3. LoginFormコンポーネントの刷新

- [x] 3.1 LoginFormのスタイリングとパスワード表示切替状態管理
  - パスワード可視性状態（showPassword）をuseStateで管理
  - メールアドレス入力フィールドにMailアイコンとプレースホルダー「メールアドレス」を設定
  - パスワード入力フィールドにLockアイコン、Eye/EyeOff切替、プレースホルダー「パスワード」を設定
  - 入力フィールドのフォーカススタイルとカラーパレットを適用
  - ログインボタンにプライマリカラー（#36454F背景、白テキスト）を適用
  - ローディング状態の表示を維持
  - 「パスワードをお忘れですか?」リンクのスタイリングを調整
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 7.1_

## Task 4. LoginPageレイアウトの全面リデザイン

- [x] 4.1 ログインページのレイアウトと背景デザイン
  - モバイルファーストレイアウト（max-width: 28rem）を中央配置で実装
  - 背景色（#F8F8F8）を適用
  - グラデーション背景効果（ぼかしの円形要素）を実装
  - フォームをカード型レイアウト（白背景、丸角、影付き）で表示
  - 全体の高さを画面全体（h-dvh）に設定し中央揃え
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4.2 ヘッダーとブランディング要素の配置
  - 左上にBackArrowコンポーネントを配置（クリックで前のページに戻る）
  - 卒業帽（GraduationCap）アイコンをヘッダー領域に表示
  - 「おかえりなさい」メインヘッダーテキストを表示
  - 「学内コミュニティへようこそ」サブテキストを表示
  - テキストカラー（#333333）を適用
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.3 Googleログインと補助リンクの統合
  - ログインボタンとGoogleログインボタンの間に「または」区切り線を配置
  - GoogleLoginButtonコンポーネントを配置
  - 「アカウントをお持ちでないですか? 新規登録はこちら」リンクをフォーム下部に配置
  - リンククリックでサインアップページへナビゲート
  - _Requirements: 6.1, 6.2, 6.3, 7.2, 7.3_

## Task 5. アイコンとスタイリングの統一

- [x] 5.1 lucide-reactアイコンの適用とホバー/フォーカス状態
  - 全コンポーネントでlucide-reactアイコン（Mail, Lock, Eye, EyeOff, ArrowLeft, GraduationCap）を使用
  - cn()ユーティリティでクラスマージを適用
  - ホバー/フォーカス状態のトランジションを各インタラクティブ要素に適用
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

## Task 6. テストとバリデーション

- [x] 6.1 コンポーネントのユニットテスト
  - InputWithIcon: パスワード表示切替ロジックのテスト
  - GoogleLoginButton: レンダリングとhref属性の確認
  - _Requirements: 3.4, 4.3_

- [x]* 6.2 統合テストとE2Eテスト
  - LoginForm: フォーム入力→バリデーション→送信フローのテスト
  - パスワード表示切替の状態連携テスト
  - ログインページ表示確認
  - Googleログインボタンクリック→OAuth開始の確認
  - _Requirements: 3.4, 5.3, 5.4, 5.5, 5.6, 5.7, 6.3_
