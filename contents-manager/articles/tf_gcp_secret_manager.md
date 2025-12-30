---
title: "Google CloudのSecret ManagerをTerraformで設定する"
tags: ["terraform", "google cloud"]
publishedAt: "2025-12-27"
---

## はじめに 

Google CloudでSecret Managerを使用する際に、以下のようなケースがあります。

- DBパスワードなど、自動生成で十分なもの
- 外部APIキーなど、手動で設定したいもの

今やってる個人開発ではTerraformを使ってインフラをコード化しているので、Secret ManagerのシークレットもTerraformで生成/管理したい気持ちがあったため、Terraformモジュールで両方に対応した方法を実装したので、その方法についてまとめていきます！

## ディレクトリ構成

前述した通り、私はTerraformを使う時はモジュール構成で管理しているので、以下のようなディレクトリ構成になっています。

```bash
./terraform
├── gcp
│   ├── dev
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── versions.tf
│   │   └── terraform.tfvars
│   └── modules
│       ├── project_services
│       │   ├── main.tf
│       │   └── variables.tf
│       └── secret_manager
│           ├── main.tf
│           ├── outputs.tf
│           └── variables.tf
└── terraform.mk
```

各ファイルは以下のようになっています。

### modules/secret_manager/variables.tf

```terraform filename=modules/secret_manager/variables.tf
variable "project_id" {
  description = "Google CloudプロジェクトID"
  type        = string
}

variable "secret_id" {
  description = "シークレットの名前"
  type        = string
}

variable "auto_generate" {
  description = "パスワードを自動生成するか"
  type        = bool
  default     = true
}

variable "secret_data" {
  description = "auto_generate=false の場合に使う値"
  type        = string
  default     = ""
  sensitive   = true

  validation {
    condition     = var.auto_generate || var.secret_data != ""
    error_message = "auto_generate=false の場合は secret_data が必須です"
  }
}

variable "password_length" {
  description = "自動生成するパスワードの長さ"
  type        = number
  default     = 24
}
```

`auto_generate` 変数で自動生成するか手動設定するかを切り替えられるようにしています。

### modules/secret_manager/main.tf

```terraform filename=modules/secret_manager/main.tf
resource "random_password" "main" {
  count   = var.auto_generate ? 1 : 0
  length  = var.password_length
  special = false
}

resource "google_secret_manager_secret" "main" {
  project   = var.project_id
  secret_id = var.secret_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "main" {
  secret      = google_secret_manager_secret.main.id
  secret_data = var.auto_generate ? random_password.main[0].result : var.secret_data

  depends_on = [random_password.main]
}
```

`random_password` リソースを `count` 属性で制御し、自動生成が有効な場合のみパスワードを生成するようにしています。
また、`google_secret_manager_secret_version` リソースの `depends_on` 属性で、`random_password` リソースの生成を待つようにしています。

### modules/secret_manager/outputs.tf

```terraform filename=modules/secret_manager/outputs.tf
output "secret_id" {
  value = google_secret_manager_secret.main.secret_id
}

output "secret_data" {
  value     = var.auto_generate ? random_password.main[0].result : var.secret_data
  sensitive = true
}
```

outoputs.tfは生成されたsecretを参照するために用意しています。
`secret_data` 出力も `auto_generate` に応じて適切な値を返すようにしています。

### dev/variables.tf

```terraform filename=dev/variables.tf
# 手動設定用の変数（必要な場合のみ）
variable "external_api_key" {
  type      = string
  default   = ""
  sensitive = true
}

locals {
  env         = "dev"
  gcp_project = "your-project-id"

  secrets = {
    # 自動生成パターン
    db_password = {
      secret_id     = "myapp-${local.env}-db-password"
      auto_generate = true
    }
    # 手動設定パターン
    external_api_key = {
      secret_id     = "myapp-${local.env}-external-api-key"
      auto_generate = false
      secret_data   = var.external_api_key
    }
  }
}
```

手動設定用の変数 `external_api_key` を定義し、`locals` ブロックで環境ごとの設定をまとめています。
`secrets` マップで各シークレットの設定を管理しています。

### dev/main.tf

```terraform filename=dev/main.tf
module "secrets" {
  source   = "../modules/secret_manager"
  for_each = local.secrets

  project_id      = local.gcp_project
  secret_id       = each.value.secret_id
  auto_generate   = lookup(each.value, "auto_generate", true)
  secret_data     = lookup(each.value, "secret_data", "")
  password_length = lookup(each.value, "password_length", 24)

  depends_on = [module.project_services]
}
```

`for_each` を使用して、`locals.secrets` マップに基づいて複数のシークレットを生成しています。

### dev/terraform.tfvars

手動の値が必要な場合は、以下のように `terraform.tfvars` ファイルで指定します。

```terraform filename=dev/terraform.tfvars
external_api_key = "your-api-key-here"
```

`terraform.tfvars` ファイルで手動設定用のシークレット値を指定しています。

## ポイント解説

### 1. for_eachで複数シークレットを一括管理

```terraform
module "secrets" {
  for_each = local.secrets
  # ...
}
```

こうしておくことで、シークレットを追加したい時は`locals.secrets` に新しいエントリを追加するだけで済み、コードの重複を避けられます。

### 2. auto_generateで自動生成/手動設定を切り替え

| 値 | 動作 |
|----|-----|
| `true` | `random_password` で自動生成
| `false` | `secret_data` の値を使用 |


### 3. validation でミスを防止

```terraform
validation {
  condition     = var.auto_generate || var.secret_data != ""
  error_message = "auto_generate=false の場合は secret_data が必須です"
}
```

`auto_generate = false` で `secret_data` を渡し忘れるとplan時点でエラーになります。

### 4. sensitive = true でログ出力を防止

```terraform
variable "secret_data" {
  sensitive = true
}
```

これを入れることで、Terraformのログにシークレットの中身が出力されるのを防げます。

## まとめ

今回は、Google CloudのSecret ManagerでシークレットをTerraformで管理する方法について解説しました。
自動生成と手動設定の両方に対応できるようにすることで、柔軟にシークレット管理ができるようになって、個人的には便利な実装に感じています。
