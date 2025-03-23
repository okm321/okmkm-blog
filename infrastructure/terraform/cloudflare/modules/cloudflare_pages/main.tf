resource "cloudflare_pages_project" "blog_page" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch
}

resource "cloudflare_pages_domain" "blog_page_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.blog_page.name
  name         = var.custom_domain
}

resource "cloudflare_dns_record" "blog_page_dns" {
  zone_id = var.zone_id
  name    = var.custom_domain
  type    = "cname"
  content = "${cloudflare_pages_project.blog_page.name}.pages.dev"
  proxied = true
  ttl     = 1
}
