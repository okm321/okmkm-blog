module "artifact_registry_blog_app" {
  source        = "../modules/artifact_registry"
  repository_id = local.ar_blog_app.repository_id
  env           = local.env
}

# module "cloud_run_contents_manager" {
#   source                       = "../modules/cloud_run"
#   name                         = local.cloud_run_contents_manager.name
#   project_id                   = local.gcp_project
#   image_repo                   = module.artifact_registry_contents_manager.repository_id
#   artifact_registry_dependency = module.artifact_registry_contents_manager.repository_id
#   env                          = local.env
#   deletion_protection          = false
# }

module "secret_manager" {
  source  = "../modules/secret_manager"
  env     = local.env
  secrets = local.secrets
}
