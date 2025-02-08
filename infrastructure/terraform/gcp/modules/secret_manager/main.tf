resource "google_secret_manager_secret" "default" {
  for_each = toset(var.secrets)

  secret_id = each.value

  replication {
    auto {}
  }

  labels = {
    env = var.env
  }
}
