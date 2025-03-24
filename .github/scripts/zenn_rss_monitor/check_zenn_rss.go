package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/mmcdole/gofeed"
)

// RSSフィードのエントリー情報を格納する構造体
type Entry struct {
	ID        string `json:"id"`        // 投稿の一意なID
	Title     string `json:"title"`     // 投稿タイトル
	Link      string `json:"link"`      // 投稿へのリンク
	Published string `json:"published"` // 投稿日時
}

// RSSフィードの状態を保存するための構造体（LastUpdated削除）
type State struct {
	Entries []Entry `json:"entries"` // 最新のエントリーリスト
}

func main() {
	// 定数定義
	const (
		stateFile  = "zenn_rss_state.json"            // 状態を保存するファイル名
		rssURL     = "https://zenn.dev/okmkm321/feed" // 監視対象のRSSフィードURL
		maxEntries = 3                                // 保存・比較する最大エントリー数
	)

	// 変更検出フラグ（デフォルトはfalse）
	hasChanges := false

	// RSSパーサーの初期化とフィード取得
	fp := gofeed.NewParser()
	feed, err := fp.ParseURL(rssURL)
	if err != nil {
		fmt.Printf("フィードの取得に失敗しました: %v\n", err)
		os.Exit(1)
	}

	// 最新のエントリー情報を抽出
	var latestEntries []Entry
	for i, item := range feed.Items {
		if i >= maxEntries { // 最新N件のみ処理する
			break
		}

		// エントリー情報の構築
		entry := Entry{
			ID:        item.GUID,
			Title:     item.Title,
			Link:      item.Link,
			Published: item.Published, // 公開日時をそのまま使用
		}
		latestEntries = append(latestEntries, entry)
	}

	// 現在の状態を構築（最新のエントリーのみを保持）
	currentState := State{
		Entries: latestEntries,
	}

	// 前回の状態と比較
	if _, err := os.Stat(stateFile); err == nil {
		data, err := os.ReadFile(stateFile)
		if err == nil {
			var previousState State
			if err := json.Unmarshal(data, &previousState); err == nil {
				previousIDs := make(map[string]bool)
				for _, entry := range previousState.Entries {
					previousIDs[entry.ID] = true
				}

				var newEntries []Entry
				for _, entry := range latestEntries {
					if !previousIDs[entry.ID] {
						newEntries = append(newEntries, entry)
					}
				}

				if len(newEntries) > 0 {
					hasChanges = true
					fmt.Println("RSSフィードに変更が検出されました！")
					for _, entry := range newEntries {
						fmt.Printf("新しい記事: %s - %s\n", entry.Title, entry.Link)
					}
				} else {
					fmt.Println("変更はありません")
				}
			} else {
				// JSONのパースに失敗した場合
				hasChanges = true
				fmt.Println("前回の状態ファイルが無効です。変更として扱います。")
			}
		} else {
			// ファイル読み込みに失敗した場合
			hasChanges = true
			fmt.Println("前回の状態ファイルが読み込めません。変更として扱います。")
		}
	} else {
		// ファイルが存在しない場合（初回のみ）
		hasChanges = true
		fmt.Println("初回実行です。すべてのエントリーが新規として扱われます。")
	}

	// 現在の状態をJSONとして保存
	data, err := json.MarshalIndent(currentState, "", "  ")
	if err != nil {
		fmt.Printf("状態ファイルの保存に失敗しました: %v\n", err)
		os.Exit(1)
	}

	if err := os.WriteFile(stateFile, data, 0o644); err != nil {
		fmt.Printf("状態ファイルの保存に失敗しました: %v\n", err)
		os.Exit(1)
	}

	// GitHub Actionsの出力変数を設定
	ghOutput := os.Getenv("GITHUB_OUTPUT")
	if ghOutput != "" {
		f, err := os.OpenFile(ghOutput, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
		if err != nil {
			fmt.Printf("GITHUB_OUTPUTの書き込みに失敗しました: %v\n", err)
			os.Exit(1)
		}
		defer f.Close()

		if _, err := fmt.Fprintf(f, "has_changes=%t\n", hasChanges); err != nil {
			fmt.Printf("出力変数の設定に失敗しました: %v\n", err)
			os.Exit(1)
		}
	}
}
