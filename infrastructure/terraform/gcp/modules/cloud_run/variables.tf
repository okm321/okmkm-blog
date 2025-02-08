variable "name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "deletion_protection" {
  description = "Cloud Runのサービスが誤って削除されないようにする設定"
  type        = bool
  default     = false
}

variable "project_id" {
  description = "Google CloudのプロジェクトのID"
  type        = string
}

variable "image_repo" {
  description = "Artiface Registryのリポジトリ名"
  type        = string
}

variable "cpu" {
  description = "Cloud Runのサービスが使用するCPUのリソース制限"
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Cloud Runのサービスが使用するメモリのリソース制限"
  type        = string
  default     = "512Mi"
}

variable "env" {
  description = "The environment of the Artifact Registry repository"
  type        = string
}

variable "scaling" {
  description = "Cloud Runのサービスのスケーリング設定"
  type = object({
    min_instance_count = number
    max_instance_count = number
  })
  default = {
    min_instance_count = 0
    max_instance_count = 3
  }
}

variable "artifact_registry_dependency" {
  description = "Cloud Runのサービスが依存するリソース"
  type        = string
}
