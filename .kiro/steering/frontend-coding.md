# Frontend Coding Standards

フロントエンド（React/TanStack）のコーディング規約とパターン。

## Code Formatting

### Prettier Configuration

```javascript
{
  semi: false,           // セミコロンなし
  singleQuote: true,     // シングルクォート
  trailingComma: 'all',  // 末尾カンマあり
}
```

### ESLint

- `@tanstack/eslint-config` ベース
- TypeScript strict mode 有効

## Component Patterns

### ディレクトリ構造

コンポーネントはフォルダ単位で管理し、`index.tsx` をエントリポイントとする。

```
components/ui/Button/
├── index.tsx       # メインコンポーネント（default export）
├── types.ts        # 型定義（必要な場合）
└── hooks.ts        # コンポーネント固有hooks（必要な場合）
```

### Props Interface Pattern

```tsx
// ✅ Good: 明示的なProps interface
interface Props {
  children: React.ReactNode;
  className?: string; // Tailwindクラス拡張用
  disabled?: boolean;
}

const Button: React.FC<Props> = ({children, className, disabled = false}) => {
  // ...
};

export default Button; // default export
```

### className拡張パターン

`cn()` ユーティリティで基本スタイルとカスタムクラスをマージ。

```tsx
import {cn} from "@/utils/cn";

const Card: React.FC<Props> = ({children, className}) => {
  return (
    <div className={cn("rounded-xl shadow-lg p-4", className)}>{children}</div>
  );
};
```

## Feature Organization

### Feature-First Structure

機能（ドメイン）単位でコード配置。

```
features/{domain}/
├── components/       # 機能固有コンポーネント
│   └── LoginForm/
├── hooks/            # 機能固有hooks
│   └── useLoginForm.ts
└── login/            # サブ機能（必要な場合）
    ├── components/
    └── hooks/
```

### Shared vs Feature Components

- `components/ui/`: 再利用可能なUIプリミティブ（Button, Card, Avatar）
- `components/layout/`: レイアウト（Header, Footer）
- `features/{domain}/components/`: 機能固有コンポーネント

## API Integration

### Query Keys Pattern

Factory関数でクエリキーを管理。

```typescript
// api/routes/users/key.ts
export const usersKeys = {
  all: ["users"] as const,
  me: () => [...usersKeys.all, "me"] as const,
  lists: () => [...usersKeys.all, "lists"] as const,
  list: (query?: Record<string, unknown>) =>
    [...usersKeys.lists(), {query}] as const,
  details: () => [...usersKeys.all, "details"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};
```

### Query/Mutation Hooks

```typescript
// api/routes/users/index.ts
const useFetchSelfInfoOptions = () =>
  queryOptions({
    queryKey: usersKeys.me(),
    queryFn: async () => {
      const res = await apiClient.users.me.$get();
      if (!res.ok) {
        const data = await res.json();
        if ("message" in data) {
          throw new ApiError(data.message, res.status);
        }
        throw new ApiError("An unknown error occurred", res.status);
      }
      return await res.json();
    },
  });
```

### Error Handling

`ApiError` クラスでステータスコード付きエラーを統一管理。

```typescript
class ApiError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) { ... }
}
```

## Form Patterns

### TanStack Form + Zod

```typescript
// hooks/useLoginForm.ts
const loginFormSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const useLoginForm = () => {
  const form = useForm({
    defaultValues: {email: "", password: ""},
    validators: {onSubmit: loginFormSchema},
    onSubmit: ({value}) => {
      // mutation呼び出し
    },
  });
  return {form};
};
```

### Form Component Structure

```tsx
// components/LoginForm/index.tsx
const LoginForm: React.FC = () => {
  const {form} = useLoginForm(); // ロジックをhookに分離

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <InputWithIcon
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            // ...
          />
        )}
      </form.Field>
      {/* ... */}
    </form>
  );
};
```

## Routing Patterns

### TanStack Router File-Based

- `src/routes/` 配下のファイル構造がルートに対応
- `__root.tsx`: ルートレイアウト
- `route.tsx`: レイアウトルート
- `index.tsx`: インデックスルート

### Route Guards

```tsx
// routes/index.tsx
export const Route = createFileRoute("/")({
  beforeLoad: async ({context}) => {
    try {
      await context.queryClient.ensureQueryData(useFetchSelfInfoOptions());
    } catch (_) {
      throw redirect({to: "/auth/login"});
    }
    throw redirect({to: "/timeline/scraps"});
  },
});
```

## Import Organization

### Path Aliases

```typescript
// ✅ Good: @/ エイリアス使用
import {cn} from "@/utils/cn";
import Button from "@/components/ui/Button";
import {useLoginForm} from "@/features/auth/login/hooks/useLoginForm";

// ❌ Avoid: 深い相対パス
import {cn} from "../../../utils/cn";
```

### Import Order（推奨）

1. External libraries (`react`, `@tanstack/*`)
2. Internal absolute imports (`@/components/*`, `@/features/*`)
3. Relative imports (`./`, `../`)
4. Type imports

## Naming Conventions

| 対象           | 規則                                           | 例                                 |
| -------------- | ---------------------------------------------- | ---------------------------------- |
| コンポーネント | PascalCase                                     | `LoginForm`, `Button`              |
| Hooks          | camelCase, `use`プレフィックス                 | `useLoginForm`, `useLoginMutation` |
| ユーティリティ | camelCase                                      | `cn`, `apiClient`                  |
| 定数           | UPPER_SNAKE_CASE                               | `HeaderTitles` (配列は例外あり)    |
| ファイル       | kebab-case または PascalCase（コンポーネント） | `apiClient.ts`, `Button/index.tsx` |

## Tailwind CSS スタイリング規約

### 基本原則

1. **ユーティリティファースト**: インラインでTailwindクラスを直接記述
2. **コンポーネント抽出**: 繰り返しパターンはReactコンポーネント化
3. **`cn()` でマージ**: 基本スタイル + カスタムクラスの合成

### cn() ユーティリティ

`clsx` + `tailwind-merge` で競合を自動解決。

```typescript
// utils/cn.ts
import clsx from "clsx";
import {twMerge} from "tailwind-merge";
import type {ClassValue} from "clsx";

export const cn = (...classes: Array<ClassValue>) => twMerge(clsx(...classes));
```

### レイアウトパターン

#### Flexboxベースのレイアウト

```tsx
// ✅ Good: flex + gap でスペーシング管理
<div className="flex flex-col gap-5">
  <div className="flex flex-col gap-2 items-start">
    {/* content */}
  </div>
</div>

// ✅ Good: 中央配置
<div className="flex flex-col items-center justify-center h-full">
  {/* centered content */}
</div>

// ✅ Good: スペースbetween
<header className="flex items-center justify-between px-2 py-2">
  {/* header content */}
</header>
```

#### フルハイトレイアウト

```tsx
// Root layout pattern
<div className="flex flex-col h-dvh">
  <Header />
  <div className="flex-1 overflow-y-auto">
    <Outlet />
  </div>
  <Footer />
</div>
```

### スペーシング

#### gap優先（margin/paddingより）

```tsx
// ✅ Good: gap でアイテム間スペース
<div className="flex flex-col gap-3">
  <Item />
  <Item />
</div>

// ❌ Avoid: 個別margin
<div className="flex flex-col">
  <Item className="mb-3" />
  <Item className="mb-3" />
</div>
```

#### padding/margin命名

```tsx
// パターン: p-{size}, px-{size}, py-{size}
<div className="p-4">           // 全方向
<div className="px-2 py-2">     // 水平・垂直
<div className="px-3 py-4">     // 異なる値
```

### カラースキーム

#### slateベースのグレースケール

```tsx
// 背景
className = "bg-slate-50"; // 明るい背景
className = "bg-slate-200"; // コンテンツ領域背景
className = "bg-slate-300/70"; // 半透明

// テキスト
className = "text-slate-800"; // プライマリテキスト
className = "text-slate-500"; // セカンダリテキスト
className = "text-gray-400"; // プレースホルダー

// ボーダー
className = "border-slate-200";
className = "border-b-slate-200";
```

#### プライマリカラー（black/white）

```tsx
// ボタン・アクセント
className = "bg-black text-white";
className = "bg-white text-black border border-black";
```

### インタラクティブ要素

#### ホバー・状態管理

```tsx
// ✅ Good: hover/transition組み合わせ
<button className="bg-black text-white hover:bg-gray-800 transition-colors">

// ✅ Good: フォーカス状態（アクセシビリティ）
<input className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

// ✅ Good: カーソル指定
<p className="hover:underline cursor-pointer">
```

#### 条件付きスタイル

```tsx
// cn() で状態による切り替え
<button
  className={cn(
    'px-5 py-1 rounded-3xl text-sm font-bold transition-colors',
    isSelected
      ? 'bg-black text-white'
      : 'bg-white text-black border border-black',
  )}
>
```

### タイポグラフィ

```tsx
// 見出し
<h1 className="font-bold text-lg">       // ヘッダータイトル
<h2 className="font-bold text-4xl">      // ページタイトル

// 本文
<p className="text-md">                  // 通常テキスト
<p className="text-sm">                  // 小さいテキスト
<span className="text-sm text-slate-500"> // 補足テキスト
```

### コンポーネントスタイルパターン

#### 基本スタイル + className拡張

```tsx
// ✅ Good: 基本スタイルを定義し、classNameで拡張可能に
const Card: React.FC<Props> = ({children, className}) => {
  return (
    <div className={cn("rounded-xl shadow-lg p-4", className)}>{children}</div>
  );
};

// 使用時
<Card className="h-fit bg-slate-50">
  <LoginForm />
</Card>;
```

#### サイズバリアント（動的クラス注意）

```tsx
// ⚠️ 動的クラス生成は避ける（Tailwindがスキャンできない）
// ❌ Bad
className={`w-${size} h-${size}`}

// ✅ Good: 事前定義またはstyle属性
const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
} as const

className={cn('rounded-full', sizeClasses[size])}
```

### カスタムCSS（styles.css）

グローバルスタイルやスクロールバー非表示など、Tailwindで表現しにくいものは `styles.css` に定義。

```css
@import "tailwindcss";

/* カスタムユーティリティ */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### 避けるべきパターン

```tsx
// ❌ Avoid: @apply の多用（コンポーネント化を検討）
// ❌ Avoid: インラインstyle（Tailwindで表現可能なもの）
// ❌ Avoid: !important（cn()で解決可能）
// ❌ Avoid: 極端に長いクラス文字列（コンポーネント分割を検討）
```

---

_created_at: 2026-01-26_
_updated_at: 2026-01-26_
