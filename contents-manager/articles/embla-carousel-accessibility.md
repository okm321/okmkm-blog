---
title: "Embla Carouselでできる限りアクセシブルなカルーセルを実装してみた"
tags: ["react", "アクセシビリティ", "embla carousel", "nextjs"]
publishedAt: "2026-02-21"
---

## はじめに

Reactでカルーセルを実装する機会があったので、[Embla Carousel](https://www.embla-carousel.com/) を使ってみました。

https://www.embla-carousel.com/

カルーセルってアクセシビリティの観点から実装が難しいコンポーネントの一つですよね。せっかくなのでWAI-ARIAのカルーセルパターンに準拠した形で、できる限りアクセシブルなカルーセルを目指して実装してみました。その知見をまとめていきます。

アクセシビリティ周りの実装は、カルーセルライブラリのSplideが公開しているアクセシビリティガイドが非常に参考になりました。

https://ja.splidejs.com/guides/accessibility/

Splideのガイドでは、カルーセルにおけるtablistパターンやライブリージョンの使い分け、非表示スライドの扱いなどが丁寧に解説されています。今回はこのガイドの考え方をベースにしつつ、Embla Carouselでの実装に落とし込んでいます。

## なぜEmbla Carouselを選んだか

カルーセルライブラリを選ぶ際に重視したのは以下のポイントです。

| 観点 | Embla Carousel |
|------|---------------|
| バンドルサイズ | 軽量（コアが約3.4KB gzip） |
| ヘッドレス | UIを持たず、自由にマークアップできる |
| アクセシビリティ | マークアップを自分で制御できるのでARIAパターンを適用しやすい |
| React対応 | `embla-carousel-react` で公式サポート |
| プラグイン | Autoplay, Autoheight, Fade など必要十分 |

特にヘッドレスである点が決め手でした。Splideのようなライブラリは自前でアクセシビリティ対応のHTMLを出力してくれますが、Emblaはマークアップを完全に自分で制御できるので、WAI-ARIAパターンを自由に適用できます。逆に言えば自分でちゃんと実装しないとアクセシブルにならないので、そこは学びながら進めました。

## 基本的なセットアップ

Embla Carousel のReact向けパッケージをインストールします。

```bash
npm install embla-carousel-react
```

最小限のカルーセルはこんな感じで書けます。

```tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";

function SimpleCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: false });

  return (
    <div ref={emblaRef} style={{ overflow: "hidden" }}>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "0 0 100%", minWidth: 0 }}>スライド1</div>
        <div style={{ flex: "0 0 100%", minWidth: 0 }}>スライド2</div>
        <div style={{ flex: "0 0 100%", minWidth: 0 }}>スライド3</div>
      </div>
    </div>
  );
}
```

`useEmblaCarousel` が返す `emblaRef` をビューポートの `ref` に渡すだけで、スワイプやドラッグが動作します。CSSは `overflow: hidden` のビューポートと `display: flex` のコンテナ、`flex: 0 0 100%` の各スライドがあれば成立します。

ただ、この状態ではアクセシビリティ的にはただのdivの羅列なので、ここからARIA属性やキーボード操作を足していきます。

## WAI-ARIAカルーセルパターンの適用

アクセシビリティ対応では [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) のカルーセルパターンと、先述のSplideのアクセシビリティガイドを参考にしました。

### カルーセル全体の構造

```tsx
<div
  role="region"
  aria-label="商品画像"
  aria-roledescription="カルーセル"
>
  {/* メインスライド + コントロール */}
</div>
```

- `role="region"` でランドマークとして認識させる
- `aria-label` でカルーセルの目的を伝える
- `aria-roledescription="カルーセル"` でスクリーンリーダーに「カルーセル」と読み上げさせる

`aria-roledescription` は日本語サイトなので日本語で指定しています。英語サイトなら `"carousel"` とします。

### 各スライドのマークアップ

```tsx
<div
  role="group"
  aria-roledescription="スライド"
  aria-label={`${index + 1} / ${mediaItems.length}`}
  inert={!isSelected ? true : undefined}
>
  {/* 画像 or 動画 */}
</div>
```

- `role="group"` + `aria-roledescription="スライド"` で各スライドを識別
- `aria-label` で「3 / 5」のように現在位置を伝える
- **`inert` 属性**で非表示スライドをフォーカス不可にする

### inert属性の重要性

ここが一番大事なところです。Emblaの仕組み上、すべてのスライドは常にDOMに存在しています（`display: none` ではなく `transform` で位置をずらしている）。そのため、何も対策をしないとキーボードユーザーが画面外のスライド内のリンクやボタンにTabキーでフォーカスできてしまいます。

Splideのアクセシビリティガイドでも、非表示スライドへのフォーカスを防ぐことの重要性が解説されています。Splideでは `tabindex="-1"` や `aria-hidden` で制御していますが、今回は `inert` 属性を使いました。

`inert` を設定することで、対象要素とその子孫すべてが以下の状態になります。

- フォーカス不可
- クリック不可
- スクリーンリーダーから非表示

```tsx
// 選択中のスライドのみ操作可能にする
inert={!isSelected ? true : undefined}
```

`tabindex="-1"` + `aria-hidden="true"` の組み合わせと比べて、`inert` は一つの属性でまとめて制御できるのが便利です。子孫要素にも再帰的に効くので、スライド内にリンクやボタンがあっても個別に対応する必要がありません。

ここ地味にハマったのですが、`inert={false}` ではなく `inert={undefined}` を渡す必要があります。Reactでは `inert={false}` だと属性自体が残ってしまう場合があるので、`undefined` で属性ごと除去しないとダメでした。

## ドットインジケーターのtablistパターン

ドットインジケーター（ページネーション）は、WAI-ARIAの **tablist パターン** で実装しています。Splideのガイドでもページネーションにtablistパターンを採用しており、それに倣いました。

```tsx
<div
  role="tablist"
  aria-label="スライド操作"
  onKeyDown={handleKeyDown}
>
  {scrollSnaps.map((_, index) => (
    <button
      key={index}
      type="button"
      role="tab"
      onClick={() => onDotButtonClick(index)}
      aria-selected={index === selectedIndex}
      aria-label={altTexts[index]}
      tabIndex={index === selectedIndex ? 0 : -1}
    />
  ))}
</div>
```

### ローヴィングタブインデックス

tablistパターンでは **ローヴィングタブインデックス（Roving tabindex）** を使います。

- 選択中のタブのみ `tabIndex={0}`（Tabキーでフォーカス可能）
- それ以外は `tabIndex={-1}`（Tabキーではスキップ、プログラムからはフォーカス可能）

これにより、Tabキーを押したときにドット群を一気にスキップでき、ドット内の移動は矢印キーで行えます。5枚のスライドがある場合でも、Tabキーを5回押す必要がなくなります。

### キーボード操作の実装

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  let nextIndex: number | null = null;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    nextIndex = (selectedIndex + 1) % scrollSnaps.length;
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    nextIndex = (selectedIndex - 1 + scrollSnaps.length) % scrollSnaps.length;
  } else if (e.key === "Home") {
    e.preventDefault();
    nextIndex = 0;
  } else if (e.key === "End") {
    e.preventDefault();
    nextIndex = scrollSnaps.length - 1;
  }

  if (nextIndex !== null) {
    onDotButtonClick(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }
};
```

- `←` `→` でスライド切り替え + フォーカス移動
- `Home` `End` で最初/最後に移動
- 矢印キーはループ（最後の次は最初に戻る）

## ドットのオーバーレイ表示

スペースを節約するために、ドットインジケーターをメイン画像の上にオーバーレイで表示しています。

```css
.dotsOverlay {
  position: absolute;
  inset-inline: 0;
  bottom: 8px;
  display: flex;
  justify-content: center;
  pointer-events: none;

  & > * {
    pointer-events: auto;
    background-color: rgb(255 255 255 / 70%);
    border-radius: 9999px;
    padding: 4px 8px;
  }
}
```

### pointer-eventsの二段構え

`pointer-events: none` をオーバーレイ全体に、`pointer-events: auto` をドットコンテナに設定しています。こうすることで、ドット以外の領域ではスワイプ操作がそのまま背面のカルーセルに伝わります。ドットがスワイプの邪魔をしないようにするための工夫です。

### コントラストの確保

画像の上にドットを重ねると、明るい画像の上だと白いドットが見えなくなる問題があります。`rgb(255 255 255 / 70%)` の半透明背景（ピル型）をドットの親要素に設定して、どんな画像の上でも視認できるようにしました。

## useSelectedIndexフック

Emblaの `select` イベントを購読して現在のスライドインデックスを返すカスタムフックです。メインカルーセルとサムネイルの同期にも使っています。

```tsx
export const useSelectedIndex = (
  emblaApi: EmblaCarouselType | undefined,
) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return { selectedIndex };
};
```

`useEmblaCarousel` が返す `emblaApi` はマウント後に非同期で初期化されるので、初期値は `undefined` になります。`useEffect` 内で `emblaApi` の存在チェックをしてからイベント登録して、クリーンアップで `off` を呼ぶのがお作法です。

## aria-liveは不要だった話

実装中に「スライドが切り替わったことを `aria-live` で通知すべきか？」と迷いました。Splideのガイドでもライブリージョンの扱いについて触れられていて、自動再生時はスライド切り替わりを `aria-live="polite"` で通知し、ユーザー操作時は `aria-live="off"` にするという使い分けが紹介されています。

ただ、今回の実装では結論として **`aria-live` は不要** でした。

理由はEmblaの内部実装にあります。Emblaは `transform` でスライドをずらす仕組みで、DOM要素の追加・削除は発生しません。すべてのスライドは常にDOMに存在しています。`inert` で非表示スライドを非活性にし、`aria-selected` で選択状態を伝えているため、`aria-live` を追加するとかえって冗長な読み上げが発生してしまいます。

**`aria-live` が有効なケース**: スライドの内容を動的にDOMから追加・削除するタイプのカルーセル（仮想スクロール方式など）

**`aria-live` が不要なケース**: 全スライドが常にDOMに存在し、`transform` で位置をずらすタイプ（Emblaはこちら）

ライブラリの内部実装によって最適なARIAの使い方が変わるのが、カルーセルのアクセシビリティ対応の難しいところだなと感じました。

## おわりに

Embla Carouselはヘッドレスなのでマークアップの自由度が高く、WAI-ARIAパターンをちゃんと適用しやすいライブラリでした。カルーセルのようにアクセシビリティの考慮事項が多いUIだと、マークアップを完全に制御できるのは大きなメリットだと感じています。

今回実装したアクセシビリティ対応をまとめるとこんな感じです。

- `role="region"` + `aria-roledescription="カルーセル"` でカルーセル全体を識別
- `inert` で非表示スライドを完全に非活性化
- tablist パターン + ローヴィングタブインデックスでドットのキーボード操作
- `pointer-events` の二段構えでオーバーレイUIとスワイプを両立
- コントラスト確保のための半透明背景

個人的には `inert` 属性が一番インパクトが大きくて、これだけでキーボード操作のUXがかなり改善されました。

Splideのように最初からアクセシビリティが組み込まれているライブラリを使うのも良い選択肢ですが、ヘッドレスなライブラリで自分の手でARIAパターンを実装してみると、カルーセルのアクセシビリティについてより深く理解できると思います。カルーセルのアクセシビリティ対応で悩んでいる方の参考になれば幸いです。

### そもそもカルーセルが必要か？という話

最後に一つだけ。ここまで色々書いておいてアレなのですが、「[Webアプリケーションアクセシビリティ](https://gihyo.jp/book/2023/978-4-297-13366-5)」という本の中で「そもそもカルーセルを使う必要があるのか？」という問いかけがあって、これがなかなか刺さりました。

実際、カルーセルをアクセシブルにするのはかなり大変です。`inert`、tablist パターン、ローヴィングタブインデックス、キーボード操作...とやることが多く、費用対効果で見ると正直あまり良くない。さらに、そもそもユーザーがカルーセルの2枚目以降をスクロールしてくれない問題もよく知られています。

なので、カルーセルを採用する前に「これは本当にカルーセルでないとダメか？」は一度立ち止まって考えたほうがいいと思います。複数の画像を限られたスペースで見せたいケースならカルーセルの妥当性はありますが、マーケティング用のバナーローテーションとかであれば、静的な画像1枚で十分なケースも多いはずです。

## 参考

https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

https://ja.splidejs.com/guides/accessibility/

https://www.embla-carousel.com/

https://gihyo.jp/book/2023/978-4-297-13366-5
