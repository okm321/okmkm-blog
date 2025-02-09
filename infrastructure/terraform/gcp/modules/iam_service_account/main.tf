resource "google_service_account" "sa" {
  project      = var.project_id
  account_id   = "${var.account_id}-${var.env}"
  display_name = "${var.account_id}-${var.env}"
}

resource "google_project_iam_member" "binding" {
  project = var.project_id
  member  = "serviceAccount:${google_service_account.sa.email}"

  for_each = toset(var.roles)
  role     = each.value
}
