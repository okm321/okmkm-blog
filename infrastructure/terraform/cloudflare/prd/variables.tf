variable "cloudflare_api_token" {
  description = "CloudflareのAPIトークン"
  type        = string
  sensitive   = true
}

variable "cloudflare_okmkmdev_zone_id" {
  description = "CloudflareのzoneID"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "CloudflareのaccountID"
  type        = string
  sensitive   = true
}

locals {
  /*********************
    Common
   *********************/
  env = "prd"

  /*********************
    CloudFlare Pages
   *********************/
  cloudflare_pages = {
    cloudflare_account_id = var.cloudflare_account_id
    project_name          = "okmkm-blog",
    production_branch     = "main",
    custom_domain         = "blog.okmkm.dev",
    zone_id               = var.cloudflare_okmkmdev_zone_id
  }
}

