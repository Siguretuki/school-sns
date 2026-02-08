# カードデザイン改修仕様書

## 概要
タイムライン（Scraps, Artifacts）におけるコンテンツカードのUIデザインを、提供された画像を元に刷新する。

## Scraps カードデザイン
- **コンテナ**:
    - 背景色: 白 (`bg-white`)
    - 角丸: `rounded-xl`
    - ボーダー: 薄いグレー (`border-slate-200`)
    - シャドウ: `shadow-sm` または `shadow`
    - パディング: `p-4`
- **ヘッダー**:
    - **アバター**: 左端 (`w-10 h-10`程度), 円形
    - **ユーザー名**: 太字 (`font-bold`), テキスト色 (`text-slate-900`)
    - **時間**: 相対時間 (例: `2分前`, `2m`), グレー (`text-slate-500`), 中点区切り (`•`)
    - **メニュー**: 右上の三点リーダーアイコン (`MoreHorizontal`), インタラクションは未実装（アイコンのみ配置）
- **ボディ**:
    - **本文**: テキスト (`text-slate-800`), `whitespace-pre-wrap`
    - **ハッシュタグ**: 青色 (`text-blue-600`)
    - **リンクプレビュー**: (今回は実装対象外だがスペースは考慮)
- **フッター**:
    - **いいね**: ハートアイコン + カウント数（未実装時は0）, いいね済みは青/赤, 未はグレー
    - **コメント**: 吹き出しアイコン + カウント数
    - 垂直配置ではなく水平配置、アイコンと数字の間隔調整

## Artifacts カードデザイン
- **コンテナ**:
    - レイアウト: フレックス (`flex-row`)
    - 背景色: 白
    - ボーダー: `border-slate-200`
    - 角丸: `rounded-xl`
    - ホバーエフェクト: `hover:shadow-md transition-shadow`
- **左側（サムネイル）**:
    - プレースホルダー画像または `assets` 画像
    - アスペクト比: 1:1 または 4:3
    - 角丸: `rounded-lg`
    - サイズ: 固定幅 (例: `w-32` ~ `w-48`)
- **右側（コンテンツ）**:
    - **上部バッジ**: `ARTIFACT` バッジ (緑系 `bg-emerald-100 text-emerald-600` 等)
    - **時間**: 相対時間
    - **タイトル**: 大きく太字 (`text-lg font-bold`)
    - **説明文**: 2-3行で省略 (`line-clamp-2`)
    - **タグ**: ハッシュタグ (`#UIUX #Eco` 等), 紫系 (`text-indigo-600`)
    - **フッター**:
        - ユーザー情報（小アバター + 名前）
        - いいね数（右寄せ）

## 技術的変更点
- **依存関係**: `date-fns` の導入（相対時間表示用）
- **ファイル**:
    - `features/timeline/scraps/components/ScrapPreview/index.tsx`
    - `features/timeline/artifacts/components/ArtifactPreview/index.tsx`
