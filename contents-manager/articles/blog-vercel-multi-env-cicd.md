---
title: "Vercel Pro プランで複数環境（dev/stg/prd）を GitHub Actions で実現した"
tags: ["vercel", "github actions", "cicd"]
publishedAt: "2026-01-10"
---

## はじめに

Next.js プロジェクトを Vercel にデプロイする際、開発（dev）、ステージング（stg）、本番（prd）の3環境を構築しようとしたところ、Vercel Pro プランの制約にぶつかりました。

この記事では、その制約を GitHub Actions で回避して複数環境を実現した方法を紹介していきます。

## やりたかったこと

```
dev ブランチ  → dev 環境（開発用）
stg ブランチ  → stg 環境（ステージング）
main ブランチ → prd 環境（本番）
```

加えて、PR 作成時には対応する環境のプレビューデプロイも行いたい。

## Vercel Pro プランの制約

### 制約1: Custom Environment は1つだけ

Vercel には以下の環境が用意されています：

| 環境 | 説明 |
|------|------|
| Production | 本番環境（組み込み） |
| Preview | PR プレビュー用（組み込み） |
| Development | ローカル開発用（組み込み） |
| Custom Environment | 追加の環境（**Pro プランでは1つまで**） |

つまり、Pro プランでは **Production + Custom Environment の2環境** しか作れません。dev / stg / prd の3環境を1つのプロジェクトで管理するのは不可能でした。

### 制約2: Preview 環境の環境変数が固定

Vercel の Preview 環境は便利なのですが、大きな制約があります。

**環境変数が固定で、PR のターゲットブランチに応じて切り替えられない。**

例えば：
- `feature/xxx → dev` の PR → dev 用の環境変数を使いたい
- `release/xxx → main` の PR → prd 用の環境変数を使いたい

しかし Vercel の Preview 環境変数は1セットしか設定できないため、どちらかが正常に動かなくなります。

## 解決策: GitHub Actions で自前デプロイ

Vercel の自動デプロイ機能を使わず、GitHub Actions + Vercel CLI でデプロイを制御することにしました。

### アーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│ Vercel                                                  │
├─────────────────────────────────────────────────────────┤
│ hanasho-ec-web (メインプロジェクト)                      │
│   ├── Production → main ブランチ                        │
│   └── Custom Environment (stg) → stg ブランチ           │
├─────────────────────────────────────────────────────────┤
│ hanasho-ec-web-dev (別プロジェクト)                      │
│   └── Production → dev ブランチ                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ GitHub Environments                                     │
├─────────────────────────────────────────────────────────┤
│ dev          → CD 用（hanasho-ec-web-dev の secrets）   │
│ stg          → CD 用                                    │
│ production   → CD 用                                    │
│ preview-dev  → Preview 用（dev 環境の secrets）         │
│ preview-stg  → Preview 用                               │
│ preview-prd  → Preview 用                               │
└─────────────────────────────────────────────────────────┘
```

### ポイント

1. **dev だけ別プロジェクト**
   - stg と prd は同じプロジェクト内（stg は Custom Environment を使用）
   - dev は別プロジェクトの Production 環境として扱う

2. **環境変数は GitHub Secrets で管理**
   - Vercel からの取得（`vercel env pull`）はやめた
   - GitHub Environment ごとに secrets を設定
   - PR のターゲットブランチに応じて使い分けが可能に

3. **Preview 用の Environment を別途作成**
   - `preview-dev`, `preview-stg`, `preview-prd` を作成
   - CD の Deployments 履歴と分離できる

## 実装

### ワークフロー構成

```
.github/
├── actions/
│   └── create-env/
│       └── action.yml           # .env 作成（Composite Action）
└── workflows/
    ├── hanasho-ec-web_cicd.yml  # CI/CD メイン
    ├── hanasho-ec-web_preview.yml # Preview
    ├── _deploy.yml              # CD 共通処理（Reusable Workflow）
    └── _preview.yml             # Preview 共通処理（Reusable Workflow）
```

### CI/CD ワークフロー

```yaml
# hanasho-ec-web_cicd.yml
name: Hanasho EC Web CI/CD

on:
  push:
    branches: [main, stg, dev]
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  setup:
    # node_modules のキャッシュ作成

  type-check:
    needs: setup
    # 型チェック（並列実行）

  lint:
    needs: setup
    # Lint（並列実行）

  test:
    needs: setup
    # テスト（並列実行）

  deploy:
    name: CD (${{ github.ref_name }})
    needs: [type-check, lint, test]
    if: github.event_name == 'push'
    uses: ./.github/workflows/_deploy.yml
    with:
      # 三項演算子で環境を動的に決定
      environment: ${{ github.ref_name == 'main' && 'production' || github.ref_name == 'stg' && 'stg' || 'dev' }}
      vercel_env: ${{ github.ref_name == 'stg' && 'stg' || 'production' }}
    secrets: inherit
```

### Reusable Workflow（CD）

```yaml
# _deploy.yml
name: Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      vercel_env:
        required: true
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '24.13.0'
          cache: 'npm'

      - run: npm install -g vercel

      - run: vercel pull --yes --token=${{ secrets.VERCEL_TOKEN }}

      # Composite Action で .env 作成
      - uses: ./.github/actions/create-env
        with:
          api_base_url: ${{ secrets.API_BASE_URL }}
          api_key: ${{ secrets.API_KEY }}
          app_env: ${{ secrets.APP_ENV }}

      - name: Build
        run: |
          vercel build \
            ${{ inputs.vercel_env == 'production' && '--prod' || '' }} \
            --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy
        run: |
          vercel deploy --prebuilt \
            ${{ inputs.vercel_env == 'production' && '--prod' || '' }} \
            --token=${{ secrets.VERCEL_TOKEN }}
```

### Composite Action（.env 作成）

```yaml
# .github/actions/create-env/action.yml
name: 'Create .env file'

inputs:
  api_base_url:
    required: true
  api_key:
    required: true
  app_env:
    required: true

runs:
  using: 'composite'
  steps:
    - shell: bash
      run: |
        cat <<EOF > .env
        API_BASE_URL=${{ inputs.api_base_url }}
        API_KEY=${{ inputs.api_key }}
        APP_ENV=${{ inputs.app_env }}
        EOF
```

### Preview ワークフロー

```yaml
# hanasho-ec-web_preview.yml
name: Hanasho EC Web Preview

on:
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  preview:
    name: Preview (${{ github.base_ref }})
    uses: ./.github/workflows/_preview.yml
    with:
      # PR のターゲットブランチに応じて環境を決定
      environment: ${{ github.base_ref == 'main' && 'preview-prd' || github.base_ref == 'stg' && 'preview-stg' || 'preview-dev' }}
    secrets: inherit
```

## Reusable Workflow vs Composite Action

今回、両方を使い分けました。

| 種類 | 用途 | secrets の扱い |
|------|------|----------------|
| Reusable Workflow | ジョブ全体の共通化 | `secrets: inherit` で継承可能 |
| Composite Action | ステップの共通化 | `with:` で個別に渡す |

`.env` 作成は **Composite Action** にしています。これにより `_deploy.yml` と `_preview.yml` の両方から呼び出せて、環境変数を追加する時は `action.yml` だけ変更すればOKです。

## 動的ジョブ名で視認性向上

最初は環境ごとにジョブを分けていました：

```yaml
# Before: 3つのジョブが常に表示される
jobs:
  cd-dev:
    if: github.ref_name == 'dev'
  cd-stg:
    if: github.ref_name == 'stg'
  cd-prd:
    if: github.ref_name == 'main'
```

この場合、dev ブランチに push しても `cd-stg` と `cd-prd` が "Skipped" として表示されてしまいます。地味に見づらい。

三項演算子で1つのジョブにまとめることで解決しました：

```yaml
# After: 実行されるジョブだけ表示
jobs:
  deploy:
    name: CD (${{ github.ref_name }})
    with:
      environment: ${{ github.ref_name == 'main' && 'production' || ... }}
```

## まとめ

Vercel Pro プランの制約（Custom Environment は1つまで、Preview の環境変数が固定）を GitHub Actions で回避した構成を紹介しました。

ポイントとしては：

- dev だけ別プロジェクトにする
- 環境変数は GitHub Secrets で管理
- Reusable Workflow と Composite Action で再利用性を確保

この構成で dev / stg / prd の3環境 + 各環境向けのプレビューデプロイが実現できています。Vercel Pro プランで複数環境を構築したい方の参考になれば幸いです。
