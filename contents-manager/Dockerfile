FROM node:22

# 作業ディレクトを設定
WORKDIR /app

# ルートのpackage.jsonとpnpm-workspace.yamlをコピー
COPY --from=build-context package.json pnpm-workspace.yaml ./

# `contents-manager`のソースコードをコピー
COPY . ./contents-manager/

# pnpmをインストール
RUN npm install -g pnpm

# ワークスペースの依存関係をインストール
RUN pnpm install --filter=contents-manager --prod

# 環境変数PORTを指定
ENV PORT=8080

# アプリを実行
CMD ["pnpm", "--filter", "contents-manager", "start"]

# docker build -t contents-manager --build-context build-contexst=../ .
