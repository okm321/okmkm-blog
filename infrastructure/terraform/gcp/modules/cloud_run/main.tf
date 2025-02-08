resource "google_cloud_run_v2_service" "default" {
  name                = var.name
  location            = "asia-northeast1"
  deletion_protection = var.deletion_protection

  ingress = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
    scaling {
      min_instance_count = var.scaling.min_instance_count
      max_instance_count = var.scaling.max_instance_count
    }

    containers {
      image = "asia-northeast1-docker.pkg.dev/${var.project_id}/${var.image_repo}/${var.name}:latest"
      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [var.artifact_registry_dependency]
}
