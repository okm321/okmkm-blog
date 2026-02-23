---
title: "Go で OpenTelemetry トレーシングを導入して Cloud Trace に送る"
tags: ["go", "opentelemetry", "google cloud", "cloud trace", "observability"]
publishedAt: "2026-02-15"
---

## はじめに

個人開発の Go バックエンドに OpenTelemetry を使った分散トレーシングを導入しました。Cloud Run で動かしているアプリケーションから Google Cloud Trace にトレースデータを送って、リクエストの処理フローを可視化できるようにしています。

導入してみると思ったよりやることが多かったので、TracerProvider の初期化からスパンの作り方、ミドルウェアやDBクエリの自動計測、ログとの紐付けまで、実装の全体をまとめていきます。

## 技術スタック

- **Go**: 1.26
- **トレーシング SDK**: OpenTelemetry Go v1.40.0
- **Exporter**: `github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace` v1.31.0
- **HTTP 計測**: `github.com/riandyrn/otelchi` v0.12.2（chi ルーター用）
- **DB 計測**: `github.com/exaring/otelpgx` v0.10.0（pgx ドライバー用）
- **Web フレームワーク**: chi v5
- **DB ドライバー**: pgx v5（PostgreSQL）

## プロジェクト構成

トレーシング関連のコードは `pkg/trace/` にまとめています。

```
go/
├── cmd/server/main.go              # エントリーポイント
├── config/config.go                # 設定管理
├── pkg/
│   ├── trace/
│   │   └── trace.go                # TracerProvider初期化 + ヘルパー
│   ├── logger/
│   │   └── logger.go               # トレースID付きログ出力
│   └── postgres/
│       └── postgres.go             # DB接続（otelpgx統合）
└── internal/
    ├── application/
    │   └── group_usecase.go        # ユースケース層のスパン
    └── presentation/api/
        └── middleware.go           # otelchiミドルウェア
```

## 設定

### 環境変数

トレーシングの設定は環境変数で管理しています。

```go
// config/config.go
type Telemetry struct {
    ServiceName    string  `env:"OTEL_SERVICE_NAME" envDefault:"mahking-go"`
    ServiceVersion string  `env:"OTEL_SERVICE_VERSION" envDefault:"unknown"`
    Environment    string  `env:"OTEL_ENVIRONMENT" envDefault:"dev"`
    SampleRate     float64 `env:"OTEL_SAMPLE_RATE" envDefault:"1.0"`
}
```

| 環境変数 | 説明 | デフォルト |
|---------|------|----------|
| `OTEL_SERVICE_NAME` | トレースに記録するサービス名 | `mahking-go` |
| `OTEL_SERVICE_VERSION` | サービスバージョン | `unknown` |
| `OTEL_ENVIRONMENT` | 環境（dev / staging / prod） | `dev` |
| `OTEL_SAMPLE_RATE` | サンプリング率（0.0〜1.0） | `1.0`（100%） |
| `DEBUG` | デバッグモード（true = トレース出力なし） | `false` |
| `GCP_PROJECT_ID` | GCP プロジェクトID | `mahking-dev` |

## TracerProvider の初期化

### trace.go の全体像

```go
package trace

import (
    "context"
    "fmt"

    texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/codes"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
    "go.opentelemetry.io/otel/trace"
)

type Config struct {
    ServiceName    string
    ServiceVersion string
    Environment    string
    SampleRate     float64
    ProjectID      string
    Debug          bool
}
```

### Init 関数

```go
func Init(ctx context.Context, cfg Config) (shutdown func(context.Context) error, err error) {
    // 1. Resource（サービス情報）の定義
    res, err := resource.Merge(
        resource.Default(),
        resource.NewSchemaless(
            semconv.ServiceName(cfg.ServiceName),
            semconv.ServiceVersion(cfg.ServiceVersion),
            semconv.DeploymentEnvironment(cfg.Environment),
        ),
    )
    if err != nil {
        return nil, fmt.Errorf("create resource: %w", err)
    }

    // 2. TracerProviderのオプション設定
    opts := []sdktrace.TracerProviderOption{
        sdktrace.WithResource(res),
        sdktrace.WithSampler(sdktrace.ParentBased(sdktrace.TraceIDRatioBased(cfg.SampleRate))),
    }

    // 3. 本番環境のみExporterを追加
    if !cfg.Debug {
        exporter, err := newExporter(cfg)
        if err != nil {
            return nil, fmt.Errorf("create exporter: %w", err)
        }
        opts = append(opts, sdktrace.WithBatcher(exporter))
    }

    // 4. TracerProviderの作成とグローバル登録
    tp := sdktrace.NewTracerProvider(opts...)

    otel.SetTracerProvider(tp)
    otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
        propagation.TraceContext{},
        propagation.Baggage{},
    ))

    return tp.Shutdown, nil
}
```

順番に見ていきます。

#### 1. Resource：サービスのメタ情報

`resource.Resource` はトレースデータに付与するメタ情報で、Cloud Trace のダッシュボードでサービス名やバージョンとして表示されます。

```go
res, err := resource.Merge(
    resource.Default(),                // ホスト名やプロセスIDなどデフォルト情報
    resource.NewSchemaless(
        semconv.ServiceName(cfg.ServiceName),           // サービス名
        semconv.ServiceVersion(cfg.ServiceVersion),     // バージョン
        semconv.DeploymentEnvironment(cfg.Environment), // 環境
    ),
)
```

`semconv`（Semantic Conventions）は OpenTelemetry の標準的な属性名で、どのバックエンド（Jaeger, Cloud Trace, Datadog 等）でも共通で認識してくれます。

#### 2. Sampler：サンプリング設定

```go
sdktrace.WithSampler(sdktrace.ParentBased(sdktrace.TraceIDRatioBased(cfg.SampleRate)))
```

サンプリングの仕組みを2つ組み合わせています。

- **TraceIDRatioBased**: トレースID のハッシュ値に基づいて一定割合をサンプリング。`1.0` なら全件、`0.1` なら10%のリクエストだけトレースする
- **ParentBased**: 親スパンがある場合はその決定に従う。つまり上流サービスが「このリクエストはトレースする」と決めていたら、下流もそれに従う

個人開発で今のところトラフィックが多くないので `1.0`（100%）にしていますが、本番で負荷が高くなったら `OTEL_SAMPLE_RATE` を下げるだけで対応できます。

#### 3. Exporter：トレースの送信先

```go
if !cfg.Debug {
    exporter, err := newExporter(cfg)
    // ...
    opts = append(opts, sdktrace.WithBatcher(exporter))
}

func newExporter(cfg Config) (sdktrace.SpanExporter, error) {
    return texporter.New(texporter.WithProjectID(cfg.ProjectID))
}
```

`texporter` は Google Cloud 公式の OpenTelemetry Exporter で、Cloud Trace にトレースデータを直接送信します。Cloud Run 上で動かす場合、サービスアカウントに `roles/cloudtrace.agent` ロールが付いていれば認証は自動で通ります。

`WithBatcher` はスパンを即時送信せずバッファリングして一括送信する設定です。これによりネットワーク通信のオーバーヘッドが減ります。

デバッグモード（`DEBUG=true`）の場合は Exporter を追加しないようにしています。TracerProvider 自体は作られるので `StartSpan` / `EndSpan` のコードは普通に動きますが、トレースデータはどこにも送信されません。ローカルで開発している時に Cloud Trace に送る必要はないので。

#### 4. Propagator：コンテキスト伝播

```go
otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
    propagation.TraceContext{},
    propagation.Baggage{},
))
```

マイクロサービス間でトレースコンテキストを伝播するための設定です。正直、今すぐ必要かと言われるとそうでもないのですが、入れておいて損はないので。

- **TraceContext**: W3C Trace Context 標準。HTTP ヘッダー `traceparent` / `tracestate` でトレースIDとスパンIDを伝播
- **Baggage**: W3C Baggage 標準。任意のキーバリューペアを HTTP ヘッダー経由で伝播

現状はモノリスですが、将来的にサービスを分割した際にそのまま分散トレーシングに対応できるようにしています。

### main.go での初期化とシャットダウン

```go
func main() {
    ctx := context.Background()
    cnf := config.Get()
    logger.Init(cnf.GCP.ProjectID, cnf.Server.Debug)

    traceShutdown, err := pkgtrace.Init(ctx, pkgtrace.Config{
        ServiceName:    cnf.Telemetry.ServiceName,
        ServiceVersion: cnf.Telemetry.ServiceVersion,
        Environment:    cnf.Telemetry.Environment,
        SampleRate:     cnf.Telemetry.SampleRate,
        ProjectID:      cnf.GCP.ProjectID,
        Debug:          cnf.Server.Debug,
    })
    if err != nil {
        logger.FatalContext(ctx, fmt.Sprintf("trace init failed: %v", err))
    }
    defer func() {
        if err := traceShutdown(ctx); err != nil {
            logger.ErrorContext(ctx, fmt.Sprintf("trace shutdown failed: %v", err))
        }
    }()

    // ... サーバー起動
}
```

`Init` の返り値の `shutdown` 関数を `defer` で呼んでいます。バッファに溜まっているスパンを全てフラッシュ（送信完了）するためのもので、これを呼び忘れるとプロセス終了時に未送信のスパンが消えてしまうので注意です。

## スパンのヘルパー関数

### StartSpan / EndSpan

毎回 OpenTelemetry の API を直接呼ぶのは面倒なので、アプリケーション層でスパンを手軽に作れるヘルパーを用意しました。

```go
func StartSpan(ctx context.Context, name string, attrs ...attribute.KeyValue) context.Context {
    tr := otel.GetTracerProvider().Tracer(name)
    ctx, span := tr.Start(ctx, name)
    if len(attrs) > 0 {
        span.SetAttributes(attrs...)
    }
    return ctx
}

func EndSpan(ctx context.Context, err error) {
    span := trace.SpanFromContext(ctx)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, err.Error())
    }
    span.End()
}
```

`StartSpan` はスパンを新規作成して Context に埋め込み、`EndSpan` はスパンを終了します。エラーがあれば `RecordError` でスパンにエラーイベントを記録し、`SetStatus` でステータスを ERROR にします。

### ユースケース層での使い方

```go
func (u *GroupUsecase) List(ctx context.Context) (res []appout.Group, err error) {
    ctx = pkgtrace.StartSpan(ctx, "GroupUsecase.List")
    defer func() { pkgtrace.EndSpan(ctx, err) }()

    groups, err := u.groupRepo.List(ctx)
    if err != nil {
        return nil, err
    }
    // ...
}

func (u *GroupUsecase) Create(ctx context.Context, in appin.CreateGroupWithRule) (res *appout.Group, err error) {
    ctx = pkgtrace.StartSpan(ctx, "GroupUsecase.Create")
    defer func() { pkgtrace.EndSpan(ctx, err) }()

    // ...
}
```

ここでのポイントは `defer` と名前付き戻り値（`err error`）の組み合わせです。

`defer func() { pkgtrace.EndSpan(ctx, err) }()` は関数が return する時点の `err` の値を参照します。名前付き戻り値にしているので、関数内のどこで `err` が設定されても、`defer` はその最終値を見てスパンのステータスを決めます。

この2行を関数の冒頭に書くだけでスパンの開始・終了・エラー記録が完結するので、個人的にはボイラープレートとしてかなり軽くて気に入っています。

## HTTP ミドルウェアでの自動計測

### otelchi

chi ルーター用の OpenTelemetry ミドルウェアです。入れるだけで HTTP リクエスト/レスポンスを自動的にスパンとして記録してくれます。

```go
func registerMiddlewares(c chi.Router) {
    c.Use(middleware.Recoverer)
    c.Use(otelchi.Middleware("mahking-go", otelchi.WithChiRoutes(c)))

    c.Use(cors.Handler(cors.Options{
        // ...
    }))
}
```

`otelchi.Middleware` が自動的に以下を行います。

- リクエスト受信時にスパンを開始
- レスポンス送信時にスパンを終了
- HTTP メソッド、パス、ステータスコード等をスパン属性に付与
- `WithChiRoutes(c)` で実際のルートパターン（`/groups` など）をスパン名に使用

`Recoverer` → `otelchi` の順番にしているのは、パニック時もスパンが正しく終了するようにするためです。`Recoverer` が先に登録されることで、パニックをキャッチした後に `otelchi` のスパン終了処理が走ります。

## PostgreSQL クエリの自動計測

### otelpgx

pgx ドライバーに OpenTelemetry のトレーサーを組み込んでいます。これも設定するだけで勝手にやってくれるので楽です。

```go
func Connect(cnf DB) (*pgxpool.Pool, error) {
    cfg, err := pgxpool.ParseConfig(DSN(cnf))
    if err != nil {
        return nil, err
    }

    // ...

    cfg.ConnConfig.Tracer = otelpgx.NewTracer()
    cfg.PrepareConn = prepareSession
    cfg.AfterRelease = resetGroupSetting

    return pgxpool.NewWithConfig(context.Background(), cfg)
}
```

`otelpgx.NewTracer()` を `ConnConfig.Tracer` に設定するだけで、以下が自動的に記録されます。

- SQL クエリの実行時間
- 実行された SQL 文
- エラー情報

アプリケーションコード側は何も変える必要がなく、普通に `pool.Query()` や `pool.Exec()` を呼ぶだけで勝手にスパンが作られます。

### トレース対象外にする処理

ただ、コネクションプールの初期化時に PostgreSQL の `set_config` を呼んで RLS（Row-Level Security）用のセッション変数を設定しているのですが、これはアプリケーションロジックではないのでトレースに出したくない。ということでトレース対象外にしています。

```go
func prepareSession(ctx context.Context, conn *pgx.Conn) (bool, error) {
    // set_configはコネクション初期化用なのでトレース対象外にする
    noTraceCtx := trace.ContextWithSpan(ctx, trace.SpanFromContext(context.Background()))
    session := sessionFromContext(ctx)
    switch session.kind {
    case sessionKindGroup:
        if err := setGroupConfig(noTraceCtx, conn, session.groupID); err != nil {
            return false, err
        }
    default:
        if err := clearGroupConfig(noTraceCtx, conn); err != nil {
            return false, err
        }
    }
    return true, nil
}
```

`trace.ContextWithSpan(ctx, trace.SpanFromContext(context.Background()))` は「空のスパンコンテキスト」を設定する方法です。`context.Background()` から取得したスパン（= 無効なスパン）で上書きすることで、`otelpgx` がスパンを作成しなくなります。

やっていることを分解すると：

1. `context.Background()` → スパン情報がない空のコンテキスト
2. `trace.SpanFromContext(context.Background())` → 無効な NoOp スパンを取得
3. `trace.ContextWithSpan(ctx, ...)` → 元の ctx に無効スパンを設定

こうすることで、`set_config` の SQL 実行はトレースに出ないけど、その他の Context 情報（RLS のグループID等）は維持したまま渡せます。

## トレースの全体フロー

1つの HTTP リクエストが処理される際のスパンの親子関係はこのようになります。

```
HTTP Request: GET /groups
└── otelchi: GET /groups                    ← 自動（ミドルウェア）
    └── GroupUsecase.List                   ← 手動（StartSpan/EndSpan）
        └── pgx: SELECT * FROM groups      ← 自動（otelpgx）
```

Cloud Trace のコンソールでは、このツリーがウォーターフォール形式で可視化され、各スパンの処理時間が一目でわかります。

## ログとの紐付け

トレーシングだけだと「何が起きたか」の詳細まではわかりません。ログと紐付けることで、特定のリクエストに関するログを Cloud Logging からトレースIDで引っ張れるようになります。

ロガー側の実装は別の記事に書いていますが、要点だけまとめるとこんな感じです。

```go
// pkg/logger/logger.go
func traceAttrs(ctx context.Context) []slog.Attr {
    sc := trace.SpanFromContext(ctx).SpanContext()
    if !sc.IsValid() {
        return nil
    }

    return []slog.Attr{
        slog.String("logging.googleapis.com/trace",
            fmt.Sprintf("projects/%s/traces/%s", projectID, sc.TraceID().String())),
        slog.String("logging.googleapis.com/spanId", sc.SpanID().String()),
        slog.Bool("logging.googleapis.com/trace_sampled", sc.IsSampled()),
    }
}
```

すべてのログ出力時に Context からスパン情報を取り出して、Cloud Logging が認識するフィールド名で付与しています。

これを入れておくと、以下のことができるようになります。

- **Cloud Trace → Cloud Logging**: トレースの詳細画面から、そのリクエスト中に出力されたログを一覧表示
- **Cloud Logging → Cloud Trace**: ログエントリのトレースIDリンクをクリックして、トレース詳細に遷移

## 開発環境と本番環境の違い

| 項目 | 開発環境（DEBUG=true） | 本番環境（DEBUG=false） |
|------|----------------------|----------------------|
| Exporter | なし（送信しない） | Cloud Trace Exporter |
| TracerProvider | あり（NoOp ではない） | あり |
| StartSpan / EndSpan | 動作する（スパンは作られる） | 動作する |
| ログへのトレースID付与 | スパンが有効なら付与される | 付与される |

開発環境でも TracerProvider は初期化されるので、`StartSpan` / `EndSpan` のコードはそのまま動きます。Exporter がないだけで、コンテキスト伝播やスパンの親子関係は普通に機能するので、開発中に余計な心配をしなくて済みます。

## まとめ

OpenTelemetry を使ったトレーシングの導入は、思っていたよりシンプルでした。TracerProvider を初期化して、ミドルウェアとドライバーにプラグインするだけで HTTP / DB の自動計測が手に入るのは嬉しいポイントです。

手動スパンの `StartSpan` + `defer EndSpan` パターンも2行で完結するので、既存のコードに大きく手を入れずに導入できました。

個人的に一番良かったのは、ログとの紐付けが `logging.googleapis.com/trace` 等のフィールドを付与するだけで Cloud Logging / Cloud Trace が勝手にリンクしてくれるところです。Cloud Trace のコンソールからリクエストの流れが一目でわかるようになって、デバッグがかなり捗るようになりました。
