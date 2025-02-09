locals {
  /****************************************
    Common
  ****************************************/
  env         = "prd"
  gcp_project = "okmkm-blog"

  /****************************************
    Service Account
  ****************************************/
  service_account = {
    service_accounts = {
      cloud-run-sa = "Cloud Run Service Account"
    }
  }

  /****************************************
    Artifact Registry
  ****************************************/
  ar_okmkm_blog = {
    repository_id = "okmkm-blog-${local.env}"
  }

  /****************************************
    Cloud Run
  ****************************************/
  cloud_run_contents_manager = {
    name          = "contents-manager-${local.env}"
    repository_id = "okmkm-blog-${local.env}"
  }

  /****************************************
    Secret Manager
  ****************************************/
  secrets = []
}
