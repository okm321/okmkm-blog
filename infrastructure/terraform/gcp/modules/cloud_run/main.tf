resource "google_cloud_run_v2_service" "default" {
  name                = var.name
  location            = "asia-northeast1"
  deletion_protection = var.deletion_protection

  ingress = "internal-and-cloud-load-balancing"

  template {
    scaling {
      min_instance_count = var.scaling.min_instances
      max_instance_count = var.scaling.max_instances
    }

    containers {
      image = ""
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
}
