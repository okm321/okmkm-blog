/*********************
 CloudFlare Pages
 *********************/

module "blog-page" {
  source                = "../modules/cloudflare_pages"
  env                   = local.env
  cloudflare_account_id = local.cloudflare_pages.cloudflare_account_id
  project_name          = local.cloudflare_pages.project_name
  production_branch     = local.cloudflare_pages.production_branch
  custom_domain         = local.cloudflare_pages.custom_domain
  zone_id               = local.cloudflare_pages.zone_id
}
