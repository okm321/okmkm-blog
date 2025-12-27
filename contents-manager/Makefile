
ifeq ($(ENV),prd)
	GCP_PROJECT := okmkm-blog
else
	GCP_PROJECT := okmkm-blog-dev
endif

AR_REPOSITORY := okmkm-blog-$(ENV)
APP_NAME      := contents-manager-$(ENV)
IMAGE_NAME    := asia-northeast1-docker.pkg.dev/$(GCP_PROJECT)/$(AR_REPOSITORY)/$(APP_NAME)

SERVICE_NAME := $(APP_NAME)

ARTICLE_TEMPLATE := _article_template.md

include ../infrastructure/docker.mk

# deploy: .check-env
# 	gcloud run deploy $

.PHONY: new-article
new-article:
ifndef name
	$(error name is required: make new-article name=my-article)
endif
	@filename=$(name); \
	case $$filename in *.md) ;; *) filename="$$filename.md" ;; esac; \
	filepath=articles/$$filename; \
	if [ ! -f $(ARTICLE_TEMPLATE) ]; then echo "Error: template '$(ARTICLE_TEMPLATE)' not found"; exit 1; fi; \
	if [ -e $$filepath ]; then echo "Error: $$filepath already exists"; exit 1; fi; \
	today=$$(date +%Y-%m-%d); \
	title=$${filename%.md}; \
	sed -e "s/__TITLE__/$$title/g" -e "s/__DATE__/$$today/g" $(ARTICLE_TEMPLATE) > $$filepath; \
	echo "Created $$filepath"

build-and-push: .check-env build-image push-image

.check-env:
ifndef ENV
	$(error ENV is required.)
endif
