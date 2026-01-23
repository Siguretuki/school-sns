# DevContainer 起動時に走る setup コマンドのエラーについて

DevContainer のセットアップ中に `setup` コマンドが失敗する場合、以下の点を確認してください。

## 1. コマンドの改行コード

Windows 環境で作成されたファイルは、改行コードが CRLF (`\r\n`) になっていることがあります。これが原因で、Linux ベースの DevContainer 内でシェルスクリプトが正しく実行されないことがあります。
対策として、以下のコマンドを DevContainer 内で実行し、改行コードを LF (`\n`) に変換してください。

```bash
sed -i 's/\r$//' ./.devcontainer/scripts/setup.sh
```

または、エディタの設定で改行コードを LF に変更してから再度セットアップを試みてください。

## 2. migrate コマンドのエラー

`setup` コマンド内で `migrate` コマンドが失敗する場合、データベースの接続設定やマイグレーションファイルの整合性を確認してください。

- データベースが起動しているか確認する。
- マイグレーションファイルにエラーがないか確認する。
- 必要に応じて、手動でマイグレーションを実行してみる。

```bash
# 強制的にリセットしてマイグレーションを再実行するコマンド
cd app/backend
pnpm prisma migrate reset
# ? Are you sure you want to reset your database? All data will be lost. › (y/N) と聞かれたら y を押して実行する
```
