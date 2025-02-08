terraform {
  required_version = ">= 1.10.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.19.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.19.0"
    }
  }
}

provider "google" {
  project = local.gcp_project
}

provider "google-beta" {
  project = local.gcp_project
}
