export type ArticleTag =
	| "react"
	| "typescript"
	| "nextjs"
	| "go"
	| "vue"
	| "nuxtjs";

export type MetaData = {
	/** 記事のタイトル */
	title: string;
	/** タグ */
	// tags: ArticleTag[];
	/** 公開日時 */
	publishedAt: string;
	/** 更新日時 */
	updatedAt?: string;
};
