import type { Article } from "../entities/Article";

export class ArticleListDto {
  /** スラッグ */
  public slug: string;
  /** タイトル */
  public title: string;
  /** 公開日時 */
  public publishedAt: string;
  /** タグ */
  public tags?: string[];

  constructor(params: {
    slug: string;
    title: string;
    publishedAt: string;
    tags?: string[];
  }) {
    this.slug = params.slug;
    this.title = params.title;
    this.publishedAt = params.publishedAt;
    this.tags = params.tags;
  }

  static createFromArticle(article: Article): ArticleListDto {
    return new ArticleListDto({
      slug: article.slug,
      title: article.title,
      publishedAt: article.publishedAt,
      tags: article.tags,
    });
  }
}
