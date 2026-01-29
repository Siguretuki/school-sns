# Requirements Document

## Introduction

設定画面は、ユーザーが自分のプロフィール情報を確認・編集し、アカウントに関する各種設定を管理するためのページです。学校向けSNSにおいて、学生・教師が自身のアイデンティティを管理し、プライバシーや通知の設定をカスタマイズできる重要な機能を提供します。

## Project Description (Input)

設定画面の作成
以下のHTMLを参考にプロジェクトのコーディング規約に準拠しながら寄せる

参考HTML実装:

- プロフィール表示セクション（アイコン、名前、学科、自己紹介）
- プロフィール編集機能（アイコン変更、自己紹介編集）
- アカウント設定（通知設定、プライバシー設定）
- ログアウト機能
- バージョン情報表示
- レスポンシブデザイン（max-w-md）
- Tailwind CSS + Material Symbols Outlined使用
- パステルカラーのアクセント配色

## Requirements

### Requirement 1: プロフィール表示

**Objective:** ユーザーとして、自分のプロフィール情報を一目で確認したい。そうすることで、他のユーザーに自分がどのように表示されているかを把握できる。

#### Acceptance Criteria

1. When 設定画面にアクセスした時, the Settings Page shall ユーザーのアバター画像を円形で表示する
2. When 設定画面にアクセスした時, the Settings Page shall ユーザー名を表示する
3. When 設定画面にアクセスした時, the Settings Page shall ユーザーの自己紹介文（bio）を表示する
4. If アバター画像が設定されていない場合, then the Settings Page shall デフォルトのプレースホルダーアイコンを表示する
5. If 自己紹介文が設定されていない場合, then the Settings Page shall 未設定を示すプレースホルダーテキストを表示する

### Requirement 2: プロフィール編集

**Objective:** ユーザーとして、自分のプロフィール情報を編集したい。そうすることで、自己表現をカスタマイズできる。

#### Acceptance Criteria

1. When プロフィール編集ボタンをクリックした時, the Settings Page shall プロフィール編集モードに切り替える
2. When 編集モードでアバター変更ボタンをクリックした時, the Settings Page shall 画像選択ダイアログを表示する
3. When 新しいアバター画像を選択した時, the Settings Page shall 選択した画像をプレビュー表示する
4. When 自己紹介文の入力欄に入力した時, the Settings Page shall リアルタイムで入力内容を反映する
5. When 保存ボタンをクリックした時, the Settings Page shall 変更内容をAPIに送信して保存する
6. When プロフィール更新が成功した時, the Settings Page shall 成功メッセージを表示し編集モードを終了する
7. If プロフィール更新が失敗した場合, then the Settings Page shall エラーメッセージを表示する
8. When キャンセルボタンをクリックした時, the Settings Page shall 変更を破棄して編集モードを終了する

### Requirement 3: アカウント設定

**Objective:** ユーザーとして、通知やプライバシーの設定を管理したい。そうすることで、アプリの動作を自分の好みに合わせられる。

#### Acceptance Criteria

1. The Settings Page shall 通知設定セクションを表示する
2. When 通知設定のトグルを切り替えた時, the Settings Page shall 設定状態を即座に反映する
3. The Settings Page shall プライバシー設定セクションを表示する
4. When プライバシー設定を変更した時, the Settings Page shall 設定内容を保存する
5. While 設定の保存処理中, the Settings Page shall ローディングインジケーターを表示する

### Requirement 4: ログアウト機能

**Objective:** ユーザーとして、アカウントからログアウトしたい。そうすることで、セッションを安全に終了できる。

#### Acceptance Criteria

1. The Settings Page shall ログアウトボタンを目立つ位置に表示する
2. When ログアウトボタンをクリックした時, the Settings Page shall ログアウト確認ダイアログを表示する
3. When 確認ダイアログで「ログアウト」を選択した時, the Settings Page shall ログアウトAPIを呼び出しセッションを終了する
4. When ログアウトが成功した時, the Settings Page shall ログインページにリダイレクトする
5. If ログアウトが失敗した場合, then the Settings Page shall エラーメッセージを表示する
6. When 確認ダイアログで「キャンセル」を選択した時, the Settings Page shall ダイアログを閉じて設定画面に留まる

### Requirement 5: バージョン情報表示

**Objective:** ユーザーとして、アプリのバージョン情報を確認したい。そうすることで、使用中のアプリのバージョンを把握できる。

#### Acceptance Criteria

1. The Settings Page shall アプリのバージョン番号を画面下部に表示する
2. The Settings Page shall アプリ名を表示する

### Requirement 6: レスポンシブデザイン

**Objective:** ユーザーとして、どのデバイスでも快適に設定画面を利用したい。そうすることで、スマートフォンでもPCでも同様の体験が得られる。

#### Acceptance Criteria

1. The Settings Page shall 最大幅（max-w-md）を設定しコンテンツを中央に配置する
2. The Settings Page shall Tailwind CSSを使用してスタイリングする
3. The Settings Page shall lucide-reactアイコンを使用する
4. The Settings Page shall パステルカラーをアクセントカラーとして使用する
5. While 画面幅が狭い場合, the Settings Page shall 各要素を縦方向に配置する
6. While 画面幅が広い場合, the Settings Page shall 適切な余白を確保して可読性を維持する

### Requirement 7: 認証状態の検証

**Objective:** システムとして、認証されたユーザーのみが設定画面にアクセスできるようにしたい。そうすることで、セキュリティを確保できる。

#### Acceptance Criteria

1. When 未認証ユーザーが設定画面にアクセスしようとした時, the Settings Page shall ログインページにリダイレクトする
2. While ユーザー情報を取得中, the Settings Page shall ローディング状態を表示する
3. If ユーザー情報の取得に失敗した場合, then the Settings Page shall 適切なエラーメッセージを表示する
