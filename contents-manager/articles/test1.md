---
title: "dnd kitのdataを型安全にしてみた"
tags: ["react", "typescript"] # react, typescript, nextjs, go, vue, nuxtjs
publishedAt: "2024-11-16"
updatedAt: "2024-11-17"
---

# H1 test
## H2 test
### H3 test
#### H4 test
##### H5 test
###### H6 test
これはパラグラフです。これはパラグラフです。
これもパラグラフです。これもパラグラフです。

これはパラグラフです。
1. これはリストです。
2. これもリストです。
3. これもリストですが、長いリストです。長いリストです。長いリストです。長いリストです。長いリストです。長いリストです。
- これは箇条書きです。
- これも箇条書きです。
- これも箇条書きですが、長い箇条書きです。長い箇条書きです。長い箇条書きです。長い箇条書きです。長い箇条書きです。長い箇条書きです。

1. これはリストです。
    - これはリストです。
2. これもリストです。
    - これもリストです。

`react`とは**React**とも書きます。
テストですぅ

> これは引用やで！
> テスト
> > これは引用やで！

---

これは水平線です。

| Before | After |
| ---- | ---- |
| テーブルだよーん | テーブルです |
| テストだよーん | テストです |


```tsx filename=test.tsx
console.log("hello, world!"); // [!code --]
console.log("Hello, World!"); // [!code ++]

const test = () => {
  return (
    <div>
      <p>test</p>
    </div>
  );
}
```
