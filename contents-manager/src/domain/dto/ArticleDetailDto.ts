import type { Article } from "../entities/Article";

export class ArticleDetailDto {
	/** スラッグ */
	public slug: string;
	/** タイトル */
	public title: string;
	/** 公開日時 */
	public publishedAt: string;
	/** 編集日時 */
	public updatedAt?: string;
	/** タグ */
	public tags?: string[];
	/** 本文 */
	public body: string;

	constructor(params: {
		slug: string;
		title: string;
		publishedAt: string;
		updatedAt?: string;
		tags?: string[];
		body: string;
	}) {
		this.slug = params.slug;
		this.title = params.title;
		this.publishedAt = params.publishedAt;
		this.updatedAt = params.updatedAt;
		this.tags = params.tags;
		this.body = params.body;
	}

	static createFromArticle(article: Article): ArticleDetailDto {
		if (!article.body) {
			throw new Error("Article body is required");
		}
		return new ArticleDetailDto({
			slug: article.slug,
			title: article.title,
			publishedAt: article.publishedAt,
			updatedAt: article.updatedAt,
			tags: article.tags,
			body: article.body,
		});
	}
}
