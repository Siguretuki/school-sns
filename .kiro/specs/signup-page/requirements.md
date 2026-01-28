# Requirements Document

## Introduction

本仕様は、学校向けSNSアプリケーションのフロントエンドにおいて、サインアップ（新規登録）ページを提供するための要件を定義する。

スコープ:

- `/auth/signup` で提供されるサインアップページの表示・遷移
- メールアドレス/パスワードを用いた新規登録
- 既存のログインページと一貫したUI/UX
- （利用可能な場合）Google認証による新規登録導線

スコープ外:

- バックエンドの認証実装詳細（DB設計、暗号化方式等）
- 既存ユーザーのプロフィール編集（名前/画像/自己紹介等）

## Requirements

### Requirement 1: ルーティングと認証画面間の遷移

**Objective:** ユーザーとして、迷わず新規登録画面へ到達し、ログイン画面と相互に行き来できるようにしたい。

#### Acceptance Criteria

- 1.1 When ユーザーがブラウザで`/auth/signup`にアクセスしたとき, the Frontend App shall サインアップページを表示する
- 1.2 When ユーザーがサインアップページ上の「ログイン」導線を選択したとき, the Frontend App shall `/auth/login`へ遷移する
- 1.3 When ユーザーがログインページ上の「新規登録」導線を選択したとき, the Frontend App shall `/auth/signup`へ遷移する
- 1.4 When ユーザーが`/auth/signup`に直接アクセスしたとき, the Frontend App shall 必要な初期データが無くてもページを表示できる

### Requirement 2: サインアップページの基本表示と一貫性

**Objective:** ユーザーとして、ログインページと同じトーンの画面で安心して新規登録できるようにしたい。

#### Acceptance Criteria

- 2.1 The Frontend App shall サインアップページに「新規登録」であることが分かる見出しを表示する
- 2.2 The Frontend App shall ログインページと一貫したレイアウト（中央配置・カード等）でサインアップページを表示する
- 2.3 The Frontend App shall サインアップページにロゴ/アイコン等のブランド要素を表示する
- 2.4 While 画面表示領域が狭いデバイス幅のとき, the Frontend App shall 操作不能にならないようコンテンツをレイアウトする

### Requirement 3: 入力項目とクライアントバリデーション

**Objective:** ユーザーとして、入力ミスをその場で把握し、正しい情報で登録できるようにしたい。

#### Acceptance Criteria

- 3.1 The Frontend App shall サインアップフォームに少なくともメールアドレスとパスワードの入力欄を提供する
- 3.2 Where 表示名（name）入力が提供される場合, the Frontend App shall 表示名を任意入力として扱う
- 3.3 When ユーザーが送信を試み、メールアドレスが不正な形式のとき, the Frontend App shall 送信せずにバリデーションエラーを表示する
- 3.4 When ユーザーが送信を試み、パスワードが8文字未満のとき, the Frontend App shall 送信せずにバリデーションエラーを表示する
- 3.5 When ユーザーが送信を試み、表示名が30文字を超えるとき, the Frontend App shall 送信せずにバリデーションエラーを表示する

### Requirement 4: サインアップ実行と結果ハンドリング

**Objective:** ユーザーとして、登録の成功/失敗が明確に分かり、成功時は利用を開始できるようにしたい。

#### Acceptance Criteria

- 4.1 When ユーザーが有効な入力でフォームを送信したとき, the Frontend App shall バックエンドのサインアップAPIへ登録リクエストを送信する
- 4.2 While サインアップAPIの応答待ちのとき, the Frontend App shall 二重送信を防止する
- 4.3 When サインアップが成功したとき, the Frontend App shall ログイン済み状態として扱い、既定のログイン後画面へ遷移する
- 4.4 If メールアドレス重複を示すエラーが返却されたとき, the Frontend App shall 重複をユーザーに通知し、再入力を促す
- 4.5 If ネットワークエラーまたは予期しない失敗が発生したとき, the Frontend App shall 失敗をユーザーに通知し、入力内容を保持したまま再試行可能にする

### Requirement 5: （任意）Google認証による新規登録導線

**Objective:** ユーザーとして、メール/パスワード以外の方法でも簡単に新規登録できるようにしたい。

#### Acceptance Criteria

- 5.1 Where Google認証が利用可能なとき, the Frontend App shall サインアップページにGoogle認証を開始する導線を表示する
- 5.2 When ユーザーがGoogle認証の導線を選択したとき, the Frontend App shall Google認証フローを開始する
- 5.3 When Google認証が成功しセッションが確立されたとき, the Frontend App shall 既定のログイン後画面へ遷移する
- 5.4 If Google認証が失敗したとき, the Frontend App shall 失敗をユーザーに通知し、再試行可能にする

### Requirement 6: セキュリティ/プライバシーとアクセシビリティ

**Objective:** ユーザーとして、個人情報を安全に扱われ、誰でも操作できる画面で登録したい。

#### Acceptance Criteria

- 6.1 The Frontend App shall パスワード等の機微情報を画面上のエラーメッセージに含めない
- 6.2 The Frontend App shall パスワード等の機微情報をクライアントログへ出力しない
- 6.3 The Frontend App shall フォーム入力欄に対して判別可能なラベルまたはアクセシブルな名前を提供する
- 6.4 When ユーザーがキーボードのみで操作するとき, the Frontend App shall サインアップ完了までの操作を可能にする
