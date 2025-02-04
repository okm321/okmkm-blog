terraform {
  required_version = ">= 1.10.5"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare" # ✅ 修正
      version = "~> 5"
    }
  }
}
