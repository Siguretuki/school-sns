# Requirements Document

## Introduction

本ドキュメントは、学校SNSアプリケーションのログインページリデザインに関する要件を定義する。既存のログインページを参考デザイン（login-sample.png）に基づいて刷新し、モダンで洗練されたUIを提供することを目的とする。

## Project Description (Input)

loginページを参考HTMLとlogin-sample.pngのデザインに寄せる

参考デザインの特徴:

- モバイルファースト(max-width: 28rem)のデザイン
- Tailwind CSSベース
- Plus Jakarta Sans / Noto Sans JPフォント
- **lucide-reactアイコン使用** (Material Symbolsではなく)
- カラーパレット: プライマリ #36454F(Muted Navy Blue), 背景 #F8F8F8, テキスト #333333
- 洗練されたグラデーション背景効果(ぼかしの円形要素)
- カード型のフォームレイアウト(白背景、丸角、影付き)
- アイコン付き入力フィールド:
  - メールアドレス: Mail アイコン
  - パスワード: Lock アイコン + Eye/EyeOff 切替
- プライマリボタン「ログイン」(濃紺背景、白テキスト)
- Googleログインボタン(白背景、ボーダー、Googleロゴ)
- 「または」区切り線
- 左上にバックナビゲーション(ArrowLeft アイコン)
- 卒業帽(GraduationCap)アイコン
- 「おかえりなさい」ヘッダー
- 「学内コミュニティへようこそ」サブテキスト
- 「パスワードをお忘れですか?」リンク
- 「アカウントをお持ちでないですか? 新規登録はこちら」リンク
- それ以外は .kiro/spaces/login-page-redesign/login-sample.png に準拠

## Requirements

### Requirement 1: レイアウトと背景デザイン

**Objective:** ユーザーとして、洗練されたモダンなログインページを表示したい。これにより、学校SNSとしてのプロフェッショナルな印象を受けることができる。

#### Acceptance Criteria

1. The Login Page shall モバイルファーストのレイアウト（max-width: 28rem）を中央配置で表示する
2. The Login Page shall 背景色として #F8F8F8 を適用する
3. The Login Page shall 洗練されたグラデーション背景効果（ぼかしの円形要素）を表示する
4. The Login Page shall フォームをカード型レイアウト（白背景、丸角、影付き）で表示する
5. The Login Page shall 全体の高さを画面全体（h-dvh）に設定し、コンテンツを中央揃えで配置する

### Requirement 2: ヘッダーとブランディング

**Objective:** ユーザーとして、ログインページで学校SNSのアイデンティティを視覚的に認識したい。これにより、正しいサービスにアクセスしていることを確認できる。

#### Acceptance Criteria

1. The Login Page shall 左上にバックナビゲーション（ArrowLeftアイコン）を配置し、クリック可能にする
2. When ユーザーがバックナビゲーションをクリックした時, the Login Page shall 前のページに戻るナビゲーションを実行する
3. The Login Page shall 卒業帽（GraduationCap）アイコンをヘッダー領域に表示する
4. The Login Page shall 「おかえりなさい」というメインヘッダーテキストを表示する
5. The Login Page shall 「学内コミュニティへようこそ」というサブテキストを表示する
6. The Login Page shall Plus Jakarta Sans / Noto Sans JPフォントを適用する

### Requirement 3: メールアドレス入力フィールド

**Objective:** ユーザーとして、視覚的にわかりやすいメールアドレス入力欄を使用したい。これにより、正しく認証情報を入力できる。

#### Acceptance Criteria

1. The Login Page shall メールアドレス入力フィールドの左側にMailアイコン（lucide-react）を表示する
2. The Login Page shall 入力フィールドにプレースホルダー「メールアドレス」を表示する
3. When ユーザーがメールアドレスを入力した時, the Login Page shall 入力値をフォーム状態に反映する
4. If 無効なメールアドレス形式が入力された場合, the Login Page shall バリデーションエラーを表示する
5. The Login Page shall 入力フィールドにフォーカス時のスタイル（アウトライン）を適用する

### Requirement 4: パスワード入力フィールド

**Objective:** ユーザーとして、セキュアかつ使いやすいパスワード入力欄を使用したい。これにより、安全に認証情報を入力できる。

#### Acceptance Criteria

1. The Login Page shall パスワード入力フィールドの左側にLockアイコン（lucide-react）を表示する
2. The Login Page shall パスワード入力フィールドの右側にEye/EyeOffアイコン（lucide-react）を表示する
3. When ユーザーがEyeアイコンをクリックした時, the Login Page shall パスワードの表示/非表示を切り替える
4. While パスワードが非表示状態の時, the Login Page shall 入力値をマスク（●●●）で表示する
5. While パスワードが表示状態の時, the Login Page shall 入力値を平文で表示する
6. The Login Page shall 入力フィールドにプレースホルダー「パスワード」を表示する

### Requirement 5: ログインボタン

**Objective:** ユーザーとして、明確なログインボタンでログイン操作を実行したい。これにより、認証プロセスを開始できる。

#### Acceptance Criteria

1. The Login Page shall プライマリボタン「ログイン」をフォーム下部に表示する
2. The Login Page shall ボタンにプライマリカラー（#36454F 濃紺背景、白テキスト）を適用する
3. When ユーザーがログインボタンをクリックした時, the Login Page shall フォームバリデーションを実行する
4. If バリデーションが成功した場合, the Login Page shall ログインAPIを呼び出す
5. While ログイン処理中の時, the Login Page shall ローディング状態を表示する
6. If ログインが成功した場合, the Login Page shall タイムラインページへリダイレクトする
7. If ログインが失敗した場合, the Login Page shall エラーメッセージを表示する

### Requirement 6: Googleログインボタン

**Objective:** ユーザーとして、Googleアカウントでログインできるようにしたい。これにより、簡単にサービスにアクセスできる。

#### Acceptance Criteria

1. The Login Page shall 「または」区切り線をログインボタンとGoogleログインボタンの間に表示する
2. The Login Page shall Googleログインボタン（白背景、ボーダー、Googleロゴ）を表示する
3. When ユーザーがGoogleログインボタンをクリックした時, the Login Page shall Google OAuth2認証フローを開始する

### Requirement 7: 補助リンク

**Objective:** ユーザーとして、パスワードリセットや新規登録への導線を確認したい。これにより、必要に応じて他の操作に遷移できる。

#### Acceptance Criteria

1. The Login Page shall 「パスワードをお忘れですか?」リンクをフォーム内に表示する
2. The Login Page shall 「アカウントをお持ちでないですか? 新規登録はこちら」リンクをフォーム下部に表示する
3. When ユーザーが「新規登録はこちら」リンクをクリックした時, the Login Page shall サインアップページへナビゲートする

### Requirement 8: スタイリングとアイコン

**Objective:** 開発者として、一貫したスタイリングとアイコンライブラリを使用したい。これにより、デザインシステムの統一性を保てる。

#### Acceptance Criteria

1. The Login Page shall lucide-reactライブラリからアイコン（Mail, Lock, Eye, EyeOff, ArrowLeft, GraduationCap）を使用する
2. The Login Page shall Tailwind CSSでスタイリングを実装する
3. The Login Page shall カラーパレット（プライマリ #36454F, 背景 #F8F8F8, テキスト #333333）を適用する
4. The Login Page shall cn()ユーティリティを使用してクラスをマージする
5. The Login Page shall ホバー/フォーカス状態のトランジションを適用する
