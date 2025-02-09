COMMIT_SHA := $(shell git rev-parse HEAD)

## ビルド
##===========================
build-image: .check-image-name ## Docker Imageをビルドし、現在のコミットハッシュでタグ付けする
	DOCKER_BUILDKIT=1 docker build -t $(IMAGE_NAME):$(COMMIT_SHA) --build-context build-context=../ --platform linux/amd64 .

## Artifact Registry認証
##===========================
docker-login: ## Artifact Registryへdocker loginを実行する
	docker login -u oauth2accesstoken -p "$$(gcloud auth print-access-token)" https://asia-northeast1-docker.pkg.dev

## Docker Imageの操作(GCP)
##===========================
push-image: .check-image-name ## GCPに現在のコミットハッシュでタグ付けされたDocker Imageをpushする
	docker push $(IMAGE_NAME):$(COMMIT_SHA)

## Validation
##===========================
.check-image-name:
ifndef IMAGE_NAME
	$(error IMAGE_NAME is required.)
endif
