---
title: "Next.js 15 + Storybook 9 環境に Vitest を導入した"
tags: ["vitest", "storybook", "nextjs", "testing"]
publishedAt: "2025-12-23"
---

## はじめに

Next.js 15 + Storybook 9 の環境に Vitest を導入しました。Browser Mode と jsdom を併用したテスト環境の構築手順と、導入時に遭遇したエラーの解決方法をまとめていきます。

## 環境構成

### 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Testing**: Vitest 3.x + Testing Library
- **Browser Mode**: Playwright
- **Component Testing**: Storybook 9 + @storybook/addon-vitest

### インストールしたパッケージ

```bash
npm install -D vitest @vitest/browser @vitest/coverage-v8
npm install -D @testing-library/react @testing-library/dom @testing-library/jest-dom
npm install -D playwright
npm install -D @storybook/addon-vitest
npm install -D jsdom
npm install -D markdown-to-jsx  # Storybook addon-docs の依存関係
```

Playwright のブラウザも忘れずにインストールしておきます。

```bash
npx playwright install
```

## 導入時に遭遇したエラーと解決方法

導入してみたら結構エラーに遭遇したので、それぞれの解決方法を書いていきます。

### 1. Playwright ブラウザが見つからないエラー

```
Error: browserType.launch: Executable doesn't exist at
/Users/.../ms-playwright/chromium_headless_shell-1200/chrome-headless-shell
```

Vitest Browser Mode で Playwright を使う場合、ブラウザ実行ファイルのインストールが必要です。`npx playwright install` を実行すればOK。

### 2. 依存関係の動的最適化によるリロードエラー

```
[vitest] Vite unexpectedly reloaded a test. This may cause tests to fail,
lead to flaky behaviour or duplicated test runs.
For a stable experience, please add mentioned dependencies to your config's
`optimizeDeps.include` field manually.
```

Vite がテスト実行中に新しい依存関係を発見するたびに最適化→リロードが発生してしまう問題です。`vitest.config.ts` に `optimizeDeps.include` を追加して解決しました。

```ts
export default defineConfig({
  optimizeDeps: {
    include: [
      "@testing-library/jest-dom",
      "@storybook/addon-a11y/preview",
      "@storybook/nextjs-vite",
      "storybook/test",
      "react-aria-components",
      "next/headers",
      "next/link",
      "clsx",
      "@heroicons/react/24/outline",
    ],
  },
  // ...
});
```

### 3. markdown-to-jsx 解決エラー

```
Failed to resolve dependency: markdown-to-jsx, present in client 'optimizeDeps.include'
```

`@storybook/addon-docs` が内部で `markdown-to-jsx` を使っているのですが、明示的にインストールされていないと怒られます。

```bash
npm install -D markdown-to-jsx
```

### 4. Next.js Image の loader 警告

```
Image with src "..." has a "loader" property that does not implement width.
Please implement it or use the "unoptimized" property instead.
```

Storybook 環境で Next.js Image コンポーネントのモックローダーが width パラメータを完全に実装していないことが原因。`.storybook/preview.ts` に設定を追加して解消しました。

```ts
const preview: Preview = {
  parameters: {
    nextjs: {
      image: {
        unoptimized: true,
      },
    },
  },
};
```

### 5. TypeScript がグローバルな describe/test/vi を認識しない

```
Cannot find name 'describe'. Do you need to install type definitions for a test runner?
Cannot find name 'vi'.
Cannot find name 'expect'.
```

`vitest.config.ts` で `globals: true` を設定しても、TypeScript 側が認識してくれません。`tsconfig.json` に型定義を追加する必要がありました。

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### 6. Storybook テストのみ実行され、通常のテストが実行されない

`vitest.config.ts` の `projects` に Storybook プロジェクトだけ定義していたのが原因でした。`projects` を使用すると、そこで定義されたテストのみが実行されるので、通常のユニットテスト用プロジェクトも追加する必要があります。

```ts
projects: [
  // 通常のユニットテスト（jsdom）
  {
    extends: true,
    test: {
      name: "unit",
      include: ["src/**/*.test.{ts,tsx}"],
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  },
  // Storybookテスト（browser mode）
  {
    extends: true,
    plugins: [storybookTest({ configDir: ".storybook" })],
    test: {
      name: "storybook",
      browser: {
        enabled: true,
        headless: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
      setupFiles: [".storybook/vitest.setup.ts"],
    },
  },
],
```

## 最終的な設定ファイル

最終的に以下のような設定に落ち着きました。

### vitest.config.ts

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  optimizeDeps: {
    include: [
      "@testing-library/jest-dom",
      "@storybook/addon-a11y/preview",
      "@storybook/nextjs-vite",
      "storybook/test",
      "react-aria-components",
      "next/headers",
      "next/link",
      "clsx",
      "@heroicons/react/24/outline",
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    projects: [
      // 通常のユニットテスト（jsdom）
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.{ts,tsx}"],
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
        },
      },
      // Storybookテスト（browser mode）
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
```

### src/test/setup.tsx

```tsx
import "@testing-library/jest-dom";
import { vi } from "vitest";

// next/image をグローバルにモック
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));
```

各テストファイルで毎回 `vi.mock("next/image", ...)` を書くのは面倒なので、setup ファイルでグローバルにモックしています。JSX を使うため、拡張子は `.tsx` にしておく必要があります。

### .storybook/vitest.setup.ts

```ts
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import * as projectAnnotations from "./preview";

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
```

### tsconfig.json（追加部分）

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## テストの使い分け

### プロジェクト構成

| プロジェクト | 環境 | 対象 | 用途 |
|-------------|------|------|------|
| `unit` | jsdom | `*.test.tsx` | ロジック・ユニットテスト |
| `storybook` | Browser (Playwright) | `*.stories.tsx` | コンポーネントビジュアルテスト |

### jsdom (unit) で書くもの

- 関数・ユーティリティのロジック
- 状態管理（Zustand store など）
- 基本的なレンダリング確認
- クリック・入力などの単純なインタラクション
- API モックを使ったデータ取得テスト

### Browser mode (storybook) で書くもの

- 実際のレイアウト・CSS が関係するテスト
- IntersectionObserver、ResizeObserver などのブラウザ専用 API
- ドラッグ&ドロップ、複雑なキーボード操作
- アニメーションの動作確認

個人的には、**迷ったら jsdom で書いて、動かなかったら browser mode** という判断基準でやっています。jsdom で動くなら速い方がいいので。

## テストの書き方

### ユニットテストの例（jsdom）

```tsx
// src/components/Button/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

function setup(props: Partial<Parameters<typeof Button>[0]> = {}) {
  const user = userEvent.setup();
  const defaultProps = {
    children: "ボタン",
    ...props,
  };

  const utils = render(<Button {...defaultProps} />);

  return {
    ...utils,
    user,
  };
}

describe("Button", () => {
  test("ボタンのテキストが表示される", () => {
    setup({ children: "カートに追加" });

    expect(
      screen.getByRole("button", { name: "カートに追加" }),
    ).toBeInTheDocument();
  });

  test("ユーザーがボタンをクリックするとonPressが呼ばれる", async () => {
    const handlePress = vi.fn();
    const { user } = setup({ onPress: handlePress });

    await user.click(screen.getByRole("button"));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});
```

### Storybook インタラクションテストの例（Browser mode）

```tsx
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "ボタン",
    onPress: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClickInteraction: Story = {
  args: {
    children: "クリックしてね",
    onPress: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "クリックしてね" });

    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};
```

`@storybook/addon-vitest` により Story を書くだけでレンダリングテストが自動実行されるので、play 関数でインタラクションテストを追加するとより効果的です。

## コマンド一覧

```bash
# 全テスト実行
npm run test

# unit テストのみ
npx vitest --project=unit

# storybook テストのみ
npx vitest --project=storybook

# Storybook を起動してインタラクションを確認
npm run storybook
```

`package.json` に以下を追加しておくと便利です。

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --project=unit",
    "test:storybook": "vitest --project=storybook"
  }
}
```

## まとめ

Vitest + Storybook の組み合わせは Browser Mode と jsdom を使い分けることで、効率的なテスト環境が構築できました。

導入時のハマりポイントとしては：

- `optimizeDeps.include` を設定しないとテストが不安定になる
- `projects` でテスト環境を分離しないと片方しか実行されない
- グローバルモックは setup ファイルにまとめると楽

Story = テスト という考え方で、コンポーネントカタログとテストを一元管理できるのは個人的にかなり気に入っています。
