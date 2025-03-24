package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/mmcdole/gofeed"
)

type Entry struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Link      string `json:"link"`
	Published string `json:"published"`
}

type State struct {
	LastUpdated string  `json:"last_updated"`
	Entries     []Entry `json:"entries"`
}

func main() {
	const (
		stateFile = "zenn_rss_state.json"
		rssURL    = "https://zenn.dev/okmkm321/feed"
	)

	fp := gofeed.NewParser()

	feed, err := fp.ParseString(rssURL)
	if err != nil {
		fmt.Printf("フィードの取得に失敗しました: %v\n", err)
		os.Exit(1)
	}

	var latestEntries []Entry
	for i, item := range feed.Items {
		if i >= 3 {
			break
		}

		entry := Entry{
			ID:        item.GUID,
			Title:     item.Title,
			Link:      item.Link,
			Published: item.Published,
		}
		latestEntries = append(latestEntries, entry)
	}

	currentState := State{
		LastUpdated: feed.PublishedParsed.Format(time.RFC3339),
		Entries:     latestEntries,
	}

	hasChanges := false

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
				}
			} else {
				// JSONのパースに失敗した場合
				fmt.Println("変更なし")
			}
		} else {
			// ファイル読み込みに失敗した場合
			hasChanges = true
			fmt.Println("前回の状態ファイルが無効です。変更あり")
		}
	} else {
		// ファイルが存在しない場合（初回のみ）
		hasChanges = true
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
