variable "env" {
  description = "dev, prd..."
  type        = string
}

variable "project_id" {
  type = string
}

variable "roles" {
  description = "IAM roles"
  type        = list(string)
  default     = []
}

variable "account_id" {
  description = "service account id"
  type        = string
}
