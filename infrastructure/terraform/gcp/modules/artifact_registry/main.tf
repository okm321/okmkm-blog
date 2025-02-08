resource "google_artifact_registry_repository" "default" {
  location      = "asia-northeast1"
  repository_id = var.repository_id
  format        = "DOCKER"

  labels = {
    env = var.env
  }
}
