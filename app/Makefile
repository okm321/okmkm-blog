
ifeq ($(ENV),prd)
	GCP_PROJECT := okmkm-blog
else
	GCP_PROJECT := okmkm-blog-dev
endif

AR_REPOSITORY := okmkm-blog-$(ENV)
APP_NAME      := blog-app-$(ENV)
IMAGE_NAME    := asia-northeast1-docker.pkg.dev/$(GCP_PROJECT)/$(AR_REPOSITORY)/$(APP_NAME)

SERVICE_NAME := $(APP_NAME)

include ../infrastructure/docker.mk

# deploy: .check-env
# 	gcloud run deploy $

build-and-push: .check-env build-image push-image

.check-env:
ifndef ENV
	$(error ENV is required.)
endif

