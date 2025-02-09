module "sa_cloud_run_service_invoker" {
  source     = "../modules/iam_service_account"
  env        = local.env
  project_id = local.gcp_project
  account_id = "cloud-run-service-invoker"
  roles = [
    "roles/run.invoker",
    "roles/run.admin",
    "roles/artifactregistry.reader"
  ]
}

module "artifact_registry_okmkm_blog" {
  source        = "../modules/artifact_registry"
  repository_id = local.ar_okmkm_blog.repository_id
  env           = local.env
}

module "cloud_run_contents_manager" {
  source                       = "../modules/cloud_run"
  name                         = local.cloud_run_contents_manager.name
  project_id                   = local.gcp_project
  image_repo                   = module.artifact_registry_okmkm_blog.repository_id
  artifact_registry_dependency = module.artifact_registry_okmkm_blog.repository_id
  env                          = local.env
  service_account_email        = module.sa_cloud_run_service_invoker.sa.email
}

module "secret_manager" {
  source  = "../modules/secret_manager"
  env     = local.env
  secrets = local.secrets
}
