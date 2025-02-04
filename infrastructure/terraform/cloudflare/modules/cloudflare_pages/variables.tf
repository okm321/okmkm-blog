variable "env" {
  description = "env"
  type        = string
}

variable "cloudflare_account_id" {
  description = "CloudflareのaccountID"
  type        = string
}

variable "project_name" {
  description = "cloudflare pagesのプロジェクト名"
}

variable "production_branch" {
  description = "デプロイするブランチ名"
  default     = "main"
}

variable "custom_domain" {
  description = "カスタムドメイン"
  type        = string
  nullable    = false
}

variable "zone_id" {
  description = "DNSレコードを追加するzoneID"
  type        = string
}

