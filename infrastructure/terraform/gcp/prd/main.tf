module "artifact_registry_contents_manager" {
  source        = "../modules/artifact_registry"
  repository_id = local.ar_contents_manager.repository_id
  env           = local.env
}

module "secret_manager" {
  source  = "../modules/secret_manager"
  env     = local.env
  secrets = local.secrets
}
