resource "google_cloud_run_v2_service" "default" {
  name                = var.name
  location            = "asia-northeast1"
  deletion_protection = false

  ingress = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"

  template {
    service_account = var.service_account_email

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

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }
}
