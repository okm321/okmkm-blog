variable "secrets" {
  description = "A map of secrets to create"
  type        = list(string)
}

variable "env" {
  description = "The environment to deploy to"
  type        = string
}
