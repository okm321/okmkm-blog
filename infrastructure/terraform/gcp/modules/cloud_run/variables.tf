variable "name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "deletion_protection" {
  description = "Cloud Runのサービスが誤って削除されないようにする設定"
  type        = bool
}

variable "cpu" {
  description = "Cloud Runのサービスが使用するCPUのリソース制限"
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Cloud Runのサービスが使用するメモリのリソース制限"
  type        = string
  default     = "512MiB"
}

variable "scaling" {
  description = "Cloud Runのサービスのスケーリング設定"
  type = object({
    min_instance_count = number
    max_instance_count = number
  })
  default = {
    min_instance_count = 1
    max_instance_count = 10
  }
}
