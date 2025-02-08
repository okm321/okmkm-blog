locals {
  /****************************************
    Common
  ****************************************/
  env         = "prd"
  gcp_project = "okmkm-blog"

  /****************************************
    Artifact Registry
  ****************************************/
  ar_blog_app = {
    repository_id = "blog-app"
  }

  /****************************************
    Cloud Run
  ****************************************/
  # cloud_run_contents_manager = {
  #   name          = "contents-manager"
  #   repository_id = "contents-manager"
  # }

  /****************************************
    Secret Manager
  ****************************************/
  secrets = []
}
