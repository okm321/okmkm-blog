---
title: "Go の log/slog で Cloud Logging 対応のロガーを実装した"
tags: ["go", "slog", "google cloud", "cloud logging", "observability"]
publishedAt: "2026-02-13"
---

## はじめに

個人開発の Go バックエンドで、ロギング基盤を `log/slog`（Go 1.21+ 標準ライブラリ）ベースで実装しました。サードパーティのロギングライブラリを入れるか迷ったのですが、slog で十分できそうだったのでやってみました。

要件としてはこんな感じです。

- 本番環境（Cloud Run）では Google Cloud Logging の構造化ログ形式で出力
- 開発環境ではテキスト形式で読みやすく出力
- OpenTelemetry のトレースIDをログに自動で埋め込む（Cloud Trace との紐付け）
- エラーログにはスタックトレースを自動で付与する
- 大きなログは Cloud Logging の上限を考慮して自動分割する

この記事では、実装の全体像と各機能の詳細を書いていきます。

## 技術スタック

- **Go**: 1.26
- **ロギング**: `log/slog`（標準ライブラリ）
- **エラー**: `github.com/pkg/errors`（スタックトレース取得用）
- **トレーシング**: OpenTelemetry SDK
- **実行環境**: Cloud Run → Cloud Logging

## プロジェクト構成

ロガー関連のコードは `pkg/logger/` パッケージにまとめています。

```
go/
├── cmd/server/main.go          # エントリーポイント
├── config/config.go            # 設定管理
├── pkg/
│   ├── logger/
│   │   ├── logger.go           # ロガー本体
│   │   └── stacktrace.go       # スタックトレース処理
│   └── trace/
│       └── trace.go            # OpenTelemetry設定
└── internal/
    └── presentation/api/
        ├── handler.go          # エラーハンドリング
        └── middleware.go       # ミドルウェア
```

## ロガーの初期化

### 環境変数と設定

設定は `github.com/caarlos0/env` で環境変数から読み取るようにしています。

```go
// config/config.go
type Server struct {
    Debug bool `env:"DEBUG"`
    // ...
}

type GCP struct {
    ProjectID string `envconfig:"GCP_PROJECT_ID" default:"mahking-dev"`
    // ...
}
```

`DEBUG` 環境変数が開発/本番の切り替えスイッチになっていて、これ1つでログの出力形式・レベル・トレースの有無が全部変わります。

### Init 関数

```go
// pkg/logger/logger.go
var (
    defaultLogger *slog.Logger
    projectID     string
)

func Init(pid string, debug bool) {
    projectID = pid
    SetDebug(debug)
}
```

`projectID` はトレースIDをログに埋め込む際に `projects/{projectID}/traces/{traceID}` の形式で使うため、ここで保持しています。

### SetDebug：開発/本番でハンドラーを切り替える

```go
func SetDebug(debug bool) {
    var handler slog.Handler

    if debug {
        // 開発環境：テキスト形式 + DEBUGレベル
        handler = slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
            Level: slog.LevelDebug,
        })
    } else {
        // 本番環境：JSON形式 + INFOレベル（Cloud Logging形式）
        handler = slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
            Level: slog.LevelInfo,
            ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
                if len(groups) > 0 {
                    return a
                }
                switch a.Key {
                case slog.MessageKey:
                    a.Key = "message"
                case slog.LevelKey:
                    a.Key = "severity"
                    if level, ok := a.Value.Any().(slog.Level); ok && level == slog.LevelWarn {
                        a.Value = slog.StringValue("WARNING")
                    }
                }
                return a
            },
        })
    }

    defaultLogger = slog.New(handler)
    slog.SetDefault(defaultLogger)
}
```

ここのポイントは `ReplaceAttr` の部分です。

Cloud Logging では、ログの重要度を `severity` フィールドで判定します。slog のデフォルトだと `level` というキー名になるので、`ReplaceAttr` で変換しています。

また、slog の WARN レベルは文字列として `"WARN"` になりますが、Cloud Logging が期待するのは `"WARNING"` なので、ここも変換しています。

### main.go での初期化

```go
func main() {
    ctx := context.Background()
    cnf := config.Get()
    logger.Init(cnf.GCP.ProjectID, cnf.Server.Debug)

    // ... トレーシング初期化、サーバー起動
}
```

## ログ関数の設計

### Context を必須にする

全てのログ関数が `context.Context` を第一引数に取る設計にしました。

```go
func InfoContext(ctx context.Context, msg string, args ...any) {
    logWithTrace(ctx, slog.LevelInfo, msg, args...)
}

func WarnContext(ctx context.Context, msg string, args ...any) {
    logWithTrace(ctx, slog.LevelWarn, msg, args...)
}

func ErrorContext(ctx context.Context, msg string, args ...any) {
    logWithTrace(ctx, slog.LevelError, msg, args...)
}

func DebugContext(ctx context.Context, msg string, args ...any) {
    logWithTrace(ctx, slog.LevelDebug, msg, args...)
}

func FatalContext(ctx context.Context, msg string, args ...any) {
    logWithTrace(ctx, slog.LevelError, msg, args...)
    os.Exit(1)
}
```

なぜ Context を必須にしているかというと、OpenTelemetry のスパン情報が `context.Context` に入っているからです。これを取り出してトレースIDをログに含めることで、Cloud Logging と Cloud Trace の紐付けができるようになります。

### logWithTrace：トレース情報の自動付与

全てのログ出力がここを通るようにしています。

```go
func logWithTrace(ctx context.Context, level slog.Level, msg string, args ...any) {
    // エラーを自動検出してstacktraceを付ける
    args = processErrorsInArgs(args)

    // トレース情報を取得
    if traceAttrs := traceAttrs(ctx); len(traceAttrs) > 0 {
        // トレース情報を引数の先頭に追加
        newArgs := make([]any, 0, len(args)+len(traceAttrs)*2)
        for _, attr := range traceAttrs {
            newArgs = append(newArgs, attr.Key, attr.Value.Any())
        }
        newArgs = append(newArgs, args...)
        args = newArgs
    }

    defaultLogger.Log(ctx, level, msg, args...)
}
```

やっていることは2つです。

1. **エラー引数の自動変換**: `"error", err` のようなキーバリューペアがあれば、スタックトレース付きの構造化データに変換
2. **トレース情報の付与**: Context からスパン情報を取り出して、Cloud Logging 形式のトレースフィールドをログに追加

### traceAttrs：Cloud Logging 形式のトレースフィールド

```go
func traceAttrs(ctx context.Context) []slog.Attr {
    if ctx == nil {
        return nil
    }

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

Cloud Logging がトレース情報として認識するフィールド名は決まっているので、以下の3つを出力するようにしています。

| フィールド | 内容 |
|-----------|------|
| `logging.googleapis.com/trace` | `projects/{projectId}/traces/{traceId}` 形式 |
| `logging.googleapis.com/spanId` | スパンID |
| `logging.googleapis.com/trace_sampled` | サンプリング対象かどうか |

これを付けておくだけで、Cloud Logging のコンソールからワンクリックで Cloud Trace のトレース詳細に飛べるようになります。地味に便利。

## スタックトレース付きエラーログ

### processErrorsInArgs：エラーの自動検出

ログの引数に `error` 型が含まれていたら、自動的にスタックトレース付きの構造化データに変換するようにしています。

```go
func processErrorsInArgs(args []any) []any {
    newArgs := make([]any, 0, len(args))

    for i := 0; i < len(args); i += 2 {
        if i+1 >= len(args) {
            newArgs = append(newArgs, args[i])
            break
        }

        key := args[i]
        value := args[i+1]

        if err, ok := value.(error); ok && err != nil {
            // ErrorWithStackTrace()で変換
            // 元のキーは削除して、"error"グループとして追加
            newArgs = append(newArgs, ErrorWithStackTrace(err))
        } else {
            newArgs = append(newArgs, key, value)
        }
    }

    return newArgs
}
```

この仕組みのおかげで、呼び出し側は特に意識せず `"error", err` とキーバリューで渡すだけでOKです。

```go
// 呼び出し側はシンプル
logger.ErrorContext(ctx, "処理失敗", "error", err)
```

### ErrorWithStackTrace：構造化エラー出力

```go
// pkg/logger/stacktrace.go

type stackTracer interface {
    StackTrace() pkgerrors.StackTrace
}

func ErrorWithStackTrace(err error) slog.Attr {
    if err == nil {
        return slog.Attr{}
    }

    attrs := []any{
        slog.String("message", err.Error()),
    }

    st := getStackTrace(err)
    if st != nil {
        frames := st.StackTrace()
        if len(frames) > 0 {
            callerFrame := findCallerFrame(frames)
            attrs = append(attrs, extractErrorLocation(callerFrame)...)

            attrs = append(attrs,
                slog.String("stack_trace", formatStackTrace(frames)),
            )
        }
    }

    return slog.Group("error", attrs...)
}
```

出力される JSON はこんな感じになります。

```json
{
  "severity": "ERROR",
  "message": "処理失敗",
  "logging.googleapis.com/trace": "projects/my-project/traces/abc123...",
  "error": {
    "message": "ユーザー登録失敗: DB接続エラー",
    "file": "/app/repository/user.go",
    "line": 42,
    "function": "repository.Insert",
    "stack_trace": "repository.Insert\n\t/app/repository/user.go:42\n..."
  }
}
```

### エラーチェーンからのスタックトレース取得

`pkg/errors` で複数回ラップされたエラーの場合、最も内側（元の発生箇所）のスタックトレースを取得するようにしています。

```go
func getStackTrace(err error) stackTracer {
    var firstStackTrace stackTracer

    for {
        if st, ok := err.(stackTracer); ok {
            firstStackTrace = st
        }

        err = errors.Unwrap(err)
        if err == nil {
            return firstStackTrace
        }
    }
}
```

エラーチェーンを最後まで辿り、最後に見つかった（= 最も内側の）スタックトレースを返します。例えば：

```go
err1 := pkgerrors.New("元のエラー")           // stacktrace: [A, B, C]
err2 := fmt.Errorf("ラップ1: %w", err1)      // stacktraceなし
err3 := pkgerrors.Wrap(err2, "ラップ2")       // stacktrace: [X, Y, Z]
```

この場合、`err1` のスタックトレース `[A, B, C]` が返されます。これが実際のエラー発生箇所なので、最も有用な情報になります。

### findCallerFrame：エラーパッケージのフレームをスキップ

自前のエラーパッケージ内のフレームをスキップして、実際にエラーを発生させた箇所を特定するようにしています。

```go
func findCallerFrame(frames pkgerrors.StackTrace) pkgerrors.Frame {
    const errorPkg = "github.com/okm321/mahking-go/pkg/error"
    for _, f := range frames {
        pc := uintptr(f) - 1
        fn := runtime.FuncForPC(pc)
        if fn == nil {
            continue
        }
        if !strings.HasPrefix(fn.Name(), errorPkg) {
            return f
        }
    }
    return frames[0]
}
```

`pkg/error` パッケージで `pkgerrors.New()` や `pkgerrors.Wrap()` を呼んでいるので、そのフレームを飛ばして「本当にエラーが起きた場所」をログに出すようにしています。

## HTTP リクエストログ

Cloud Logging の `httpRequest` フィールドに対応した構造化ログも一応用意しています。

```go
func HTTPAttr(req *http.Request, statusCode int, duration time.Duration, responseSize int) slog.Attr {
    host, _, err := net.SplitHostPort(req.RemoteAddr)
    if err != nil {
        host = req.RemoteAddr
    }

    return slog.Group("httpRequest",
        slog.String("requestMethod", req.Method),
        slog.String("requestUrl", req.RequestURI),
        slog.Int("status", statusCode),
        slog.String("userAgent", req.UserAgent()),
        slog.String("remoteIp", host),
        slog.String("referer", req.Referer()),
        slog.String("protocol", req.Proto),
        slog.String("latency", fmt.Sprintf("%.9fs", duration.Seconds())),
        slog.Int("responseSize", responseSize),
    )
}
```

Cloud Logging が `httpRequest` フィールドを認識すると、リクエストメソッドやステータスコードで検索・フィルタリングできるようになります。

ただ、Cloud Run の場合はロードバランサが自動的に HTTP リクエストログを出力してくれるので、このミドルウェアは今のところ使っていません。せっかく作ったのにという気持ちもありますが、必要になったらすぐ使えるので良しとしています。

```go
// httpLogger はCloud Loggingでは不要なため一旦未使用
//
//nolint:unused
func httpLogger(next http.Handler) http.Handler {
    // ...
}
```

## 大サイズログの分割

Cloud Logging には1エントリあたりのサイズ上限があるので、大きなログを自動分割する機能も実装しました。

```go
const logSplitLength = 20000

type logSplit struct {
    UID         string `json:"uid"`
    Index       int    `json:"index"`
    TotalSplits int    `json:"totalSplits"`
}

func LargeInfo(ctx context.Context, msg string) {
    rs := []rune(msg)
    rsLength := len(rs)
    logSplitUID := uuid.NewString()
    logSplitTotalSplits := int(math.Ceil(float64(rsLength) / float64(logSplitLength)))

    for i := 0; i < logSplitTotalSplits; i++ {
        start := logSplitLength * i
        end := start + logSplitLength
        if end > rsLength {
            end = rsLength
        }
        delimited := string(rs[start:end])

        split := logSplit{
            UID:         logSplitUID,
            Index:       i,
            TotalSplits: logSplitTotalSplits,
        }

        InfoContext(ctx, delimited,
            "type", "audit",
            "split", split,
        )
    }
}
```

各分割ログには共通の `UID` と `Index` / `TotalSplits` が付与されるので、Cloud Logging 側で `UID` でフィルタすれば元のログを復元できます。`[]rune` に変換してからスライスしているのは、マルチバイト文字（日本語など）を途中で分断しないためです。

## エラーハンドリングとログレベルの使い分け

ハンドラー層では、エラーの種類によってログレベルを使い分けるようにしています。

```go
func handleError(w http.ResponseWriter, r *http.Request, err error) {
    ctx := r.Context()

    // NotFound → WARN（クライアント起因）
    var notFoundErr *pkgerror.ErrorNotFound
    if errors.As(err, &notFoundErr) {
        logger.WarnContext(ctx, "not found", "error", err)
        writeJSON(w, http.StatusNotFound, notFoundErr)
        return
    }

    // バリデーションエラー → WARN（クライアント起因）
    var validationErrs govaliderrors.ValidationErrors
    if errors.As(err, &validationErrs) {
        logger.WarnContext(ctx, err.Error(), "error", err)
        writeJSON(w, http.StatusBadRequest, ...)
        return
    }

    // アプリケーションエラー → WARN（想定内）
    var pkgErr *pkgerror.Error
    if errors.As(err, &pkgErr) {
        logger.WarnContext(ctx, err.Error(), "error", err)
        writeJSON(w, http.StatusBadRequest, pkgErr)
        return
    }

    // 予期しないエラー → ERROR（要調査）
    logger.ErrorContext(ctx, err.Error(), "error", err)
    writeJSON(w, http.StatusInternalServerError, ...)
}
```

クライアント起因のエラー（404、バリデーション失敗など）は WARN にして、サーバー側の予期しないエラーだけ ERROR にしています。こうしておくと、Cloud Logging のアラートを「ERROR レベル以上」に設定するだけでノイズが減るので運用が楽になります。

## 開発環境と本番環境の出力比較

### 開発環境（DEBUG=true）

```
time=2026-02-23T10:00:00.000+09:00 level=INFO msg="mahking-go started!"
time=2026-02-23T10:00:01.000+09:00 level=ERROR msg="処理失敗" error.message="DB接続エラー" error.file=/app/repository/user.go error.line=42
```

テキスト形式で読みやすく、DEBUG レベルから出力されます。

### 本番環境（DEBUG=false）

```json
{
  "time": "2026-02-23T01:00:00.000Z",
  "severity": "INFO",
  "message": "mahking-go started!",
  "logging.googleapis.com/trace": "projects/mahking-prd/traces/abc123...",
  "logging.googleapis.com/spanId": "def456...",
  "logging.googleapis.com/trace_sampled": true
}
```

```json
{
  "time": "2026-02-23T01:00:01.000Z",
  "severity": "ERROR",
  "message": "処理失敗",
  "logging.googleapis.com/trace": "projects/mahking-prd/traces/abc123...",
  "error": {
    "message": "DB接続エラー",
    "file": "/app/repository/user.go",
    "line": 42,
    "function": "repository.Insert",
    "stack_trace": "..."
  }
}
```

JSON 形式で、Cloud Logging が自動認識するフィールド名が使われています。

## まとめ

`log/slog` だけでここまでできるのかという感じで、個人的にはサードパーティのロギングライブラリなしでも十分実用的なロガーが作れました。

特に良かったのは以下のあたりです。

- **Cloud Logging 対応が `ReplaceAttr` だけで済む**: `severity` / `message` へのフィールド名変換がシンプル
- **トレース紐付けが自動**: Context から OpenTelemetry のスパン情報を取り出して付与するだけで Cloud Logging / Cloud Trace が連携してくれる
- **エラーログが楽**: `"error", err` と渡すだけでスタックトレースが構造化される
- **`DEBUG` 環境変数1つで切り替え**: 開発/本番の出力形式をデプロイなしで変更可能

トレーシングとの連携については別記事で詳しく書いているので、合わせて読んでもらえると嬉しいです。
