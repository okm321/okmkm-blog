---
title: "マイグレーションツールのAtlasのmigrate statusのヒストリーを確認するCLIツールを作った"
tags: ["Atlas", "DB"]
publishedAt: "2025-11-25"
---

## はじめに

個人開発のマイグレーションツールに[Atlas](https://github.com/ariga/atlas)を採用しました。

https://github.com/ariga/atlas

Atlasではマイグレーションの実行結果を `atalas migrate status`コマンドで確認できます。実行すると以下のようになります。

```bash
❯ atlas migrate status --env local
Migration Status: OK
  -- Current Version: 20251014065829
  -- Next Version:    Already at latest version
  -- Executed Files:  6
  -- Pending Files:   0
```

このコマンドは現在のマイグレーションの状態を確認するには便利なのですが、過去のマイグレーションの履歴を確認することができません。

個人的には過去のマイグレーションの履歴を確認して、「ここのマイグレーション実行時間かかってるな、修正しよう」みたいな確認をすることがあり、マイグレーションの簡易的なステータスだけでなく、実行にかかった時間などを含めた履歴を確認したいと思い、作成してみました。

## ツールの概要

作ったツールはこちらになります。 `atlas-migrate-status` というCLIツールです。

https://github.com/okm321/atlas-migrate-status

このツールを実行すると、以下のように過去のマイグレーションの履歴を確認することができます。　

```bash
Migration History (6 total)
─────────────────────────────────────────────
+----------------+-------------+----------------------------+-----------+------+--------+
|    VERSION     | DESCRIPTION |        EXECUTED AT         | DURATAION | TYPE | STATUS |
+----------------+-------------+----------------------------+-----------+------+--------+
| 20250923162538 |             | 2025-11-22 02:48:30.078948 | 354.54s   | 2    | ✅     |
| 20250923165754 |             | 2025-11-22 02:48:30.085734 | 389.54s   | 2    | ✅     |
| 20250923172244 |             | 2025-11-22 02:48:30.090270 | 460.04s   | 2    | ✅     |
| 20250923175335 |             | 2025-11-22 02:48:30.095023 | 342.75s   | 2    | ✅     |
| 20250923175718 |             | 2025-11-22 02:48:30.108030 | 473.96s   | 2    | ✅     |
| 20251214065829 |             | 2025-12-14 15:58:33.807140 | 345.17s   | 2    | ✅     |
+----------------+-------------+----------------------------+-----------+------+--------+
```

## 主な使用技術 & 構成

技術スタックとしては以下のようなものを使用しています。

| 技術 | 用途 |
|------|------|
| Go   | CLIツールの実装 |
| Cobra | CLIフレームワーク |
| pgx | DB接続 |
| tablewriter | ターミナルでの表形式表示 |

Atlasを使ってマイグレーションを行うとDBに `atlas_schema_revisions` というテーブルが作成され、そこにマイグレーションの履歴が以下のように保存されます。

```bash
+------------------+--------------------------+---------------------+
| Column           | Type                     | Modifiers           |
|------------------+--------------------------+---------------------|
| version          | character varying        |  not null           |
| description      | character varying        |  not null           |
| type             | bigint                   |  not null default 2 |
| applied          | bigint                   |  not null default 0 |
| total            | bigint                   |  not null default 0 |
| executed_at      | timestamp with time zone |  not null           |
| execution_time   | bigint                   |  not null           |
| error            | text                     |                     |
| error_stmt       | text                     |                     |
| hash             | character varying        |  not null           |
| partial_hashes   | jsonb                    |                     |
| operator_version | character varying        |  not null           |
+------------------+--------------------------+---------------------+
```

```bash
+----------------+-------------+------+---------+-------+-------------------------------+----------------+-------+------------+----------------------------------------------+----------------+----------------------------------+
| version        | description | type | applied | total | executed_at                   | execution_time | error | error_stmt | hash                                         | partial_hashes | operator_version                 |
|----------------+-------------+------+---------+-------+-------------------------------+----------------+-------+------------+----------------------------------------------+----------------+----------------------------------|
| 20250923162538 |             | 2    | 3       | 3     | 2025-11-22 02:48:30.078948+09 | 354542         |       |            | UoJt1mPMAuV/jdt6oNkrTmIsc8fC9VFLLgm2MFiOve4= | null           | Atlas CLI v0.36.3-0d3dc34-canary |
| 20250923165754 |             | 2    | 3       | 3     | 2025-11-22 02:48:30.085734+09 | 389542         |       |            | cRmlcqkpz/D7dvfhljy85GD906XBUC9oeTVM+BWmX6A= | null           | Atlas CLI v0.36.3-0d3dc34-canary |
| 20250923172244 |             | 2    | 2       | 2     | 2025-11-22 02:48:30.09027+09  | 460041         |       |            | u62ArLOY4sCMYxnH9FKCrcndV1la7xxIad1j2pT8OBM= | null           | Atlas CLI v0.36.3-0d3dc34-canary |
| 20250923175335 |             | 2    | 16      | 16    | 2025-11-22 02:48:30.095023+09 | 342750         |       |            | /vmB4I+icac125m3oSY79eHZXK3+afGSzQUlyTqPF6E= | null           | Atlas CLI v0.36.3-0d3dc34-canary |
| 20250923175718 |             | 2    | 2       | 2     | 2025-11-22 02:48:30.10803+09  | 473958         |       |            | GQXSF5JOCUpTicvIOzei5Tc1Wpx9cw6vr4OikmCnqX0= | null           | Atlas CLI v0.36.3-0d3dc34-canary |
| 20251214065829 |             | 2    | 2       | 2     | 2025-12-14 15:58:33.80714+09  | 345166         |       |            | RODmgX1PF5FZbRMezL9egGFXm6hLa9mxBIYMnQawYwI= | null           | Atlas CLI v0.36.3-0d3dc34-canary |
+----------------+-------------+------+---------+-------+-------------------------------+----------------+-------+------------+----------------------------------------------+----------------+----------------------------------+
```

このテーブルをpgxでクエリを実行して取得し、tablewriterでターミナルに表形式で表示しています。

また、Cobraを使用してCLIツールとして実装しています。フラグもいくつか用意しており、基本的にatlasのcliコマンドと同じように使用できます。

```bash
$ atlas-migrate-status --env local

$ atlas-migrate-status --env local --config ./path/to/atlas.hcl
```

## おわりに

以上がAtlasの `migrate status` コマンドのヒストリーを確認するCLIツールの紹介でした。技術面の詳細部分についてはいつか記事にしようと思ってます。

同じような悩みを持ってる方がいましたら、ぜひ使ってみてください。PRやIssueも歓迎です！
