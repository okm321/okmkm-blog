locals {
  /****************************************
    Common
  ****************************************/
  env         = "prd"
  gcp_project = "okmkm-blog"

  /****************************************
    Artifact Registry
  ****************************************/
  ar_contents_manager = {
    repository_id = "contents-manager"
  }

  /****************************************
    Secret Manager
  ****************************************/
  secrets = []
}
