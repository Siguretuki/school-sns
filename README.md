# school-sns

Mono-repo（pnpm workspace）で `backend` と `frontend` を明確に分離しつつ、ルートから一括で操作できる構成です。

- ワークスペース定義: [pnpm-workspace.yaml](pnpm-workspace.yaml)
- 統合スクリプト: [package.json](package.json)
- Backend パッケージ: [app/backend](app/backend)
- Frontend パッケージ: [app/frontend](app/frontend)

## 前提条件

- Node.js（推奨: 20 以上）
- pnpm（このリポジトリは `pnpm@10.25.0` を想定）
  - Corepack を使う場合:
    ```bash
    corepack enable
    corepack prepare pnpm@10.25.0 --activate
    ```

## セットアップ

```bash
pnpm install
```

ワークスペース配下の `backend` と `frontend` の依存が一括でインストールされます。

## 開発起動（両方を一括起動）

ルートから 1 コマンドで backend（API）と frontend（Vite）を同時起動します。

```bash
pnpm dev
```

- 仕組み: ルートの [package.json](package.json) の `dev` は、`--filter ./app/backend` と `--filter ./app/frontend` を指定して、各パッケージの `dev` を並列実行します。
- ログ: `--stream` により各パッケージのログがストリーム表示されます。
- Frontend のデフォルトポートは [app/frontend/package.json](app/frontend/package.json) の `dev` スクリプトで `3157` に設定されています（`vite --port 3157`）。

## ビルド（両方）

```bash
pnpm build
```

- ルートの [package.json](package.json) の `build` は、backend と frontend の `build` を順次実行します。

## プレビュー（本番風の起動）

```bash
pnpm preview
```

- backend: [app/backend/package.json](app/backend/package.json) の `start`（`node dist/index.js`）を起動
- frontend: [app/frontend/package.json](app/frontend/package.json) の `preview`（`vite preview`）を起動

## 個別実行（パッケージを絞る）

ワークスペースの `--filter` を使い、片方だけを起動できます。

- Backend のみ:
  ```bash
  pnpm --filter ./app/backend dev
  ```
- Frontend のみ:
  ```bash
  pnpm --filter ./app/frontend dev
  ```

## ユーティリティ（一括実行）

全パッケージの Lint / Format をルートから一括で実行できます。

```bash
pnpm lint
pnpm format
```

（必要に応じて `test` の統合スクリプトも追加可能です。現状は frontend に `vitest` が入っています。）

## よくある質問 / トラブルシューティング

- pnpm のバージョンが合わない
  - `corepack prepare pnpm@10.25.0 --activate` を実行、または手動で指定バージョンの pnpm を使用してください。
- ポート競合
  - Frontend のポートは [app/frontend/package.json](app/frontend/package.json) の `dev` で設定されています。変更する場合は `vite --port <PORT>` を編集してください。
- 片方だけが必要
  - `--filter` で対象パッケージを指定して個別に `dev`/`build`/`preview` を実行してください。

## 補足（ワークスペースのコマンド設計）

- ルートの `dev` は次のような形で定義されています:
  ```json
  {
    "scripts": {
      "dev": "pnpm -r --parallel --stream --filter ./app/backend --filter ./app/frontend run dev"
    }
  }
  ```
- 同名スクリプトを持つパッケージ群を一括実行する場合、`pnpm -r run <script>` でも可能ですが、本プロジェクトでは対象を backend/frontend に絞るため `--filter` を併用しています。
- forkした場合のgitの使い方については[こちら]('https://gist.github.com/Stone5656/69d0bbeb34b6bf20a1235cc998c30213')を参照してください

---

必要な統合タスク（例: `test` 統合、Docker 化など）があれば追記します。
