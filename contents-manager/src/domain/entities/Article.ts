export type ArticleTag = "react" | "typescript" | "nextjs" | "go";

export class Article {
  /** スラッグ */
  public slug: string;
  /** タイトル */
  public title: string;
  /** 公開日時 */
  public publishedAt: string;
  /** 編集日時 */
  public updatedAt: string;
  /** 内容 */
  public body?: string;
  /** タグ */
  public tags?: ArticleTag[];

  private constructor(params: {
    slug: string;
    title: string;
    publishedAt: string;
    updatedAt: string;
    body?: string;
    tags?: ArticleTag[];
  }) {
    this.slug = params.slug;
    this.title = params.title;
    this.publishedAt = params.publishedAt;
    this.updatedAt = params.updatedAt;
    this.body = params.body;
    this.tags = params.tags;
  }

  static create(params: {
    slug: string;
    title: string;
    publishedAt?: string;
    updatedAt?: string;
    body?: string;
    tags?: ArticleTag[];
  }): Article {
    return new Article({
      ...params,
      publishedAt: params.publishedAt ?? "",
      updatedAt: params.updatedAt ?? "",
    });
  }

  static clone(article: Article): Article {
    return new Article({
      slug: article.slug,
      title: article.title,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      body: article.body,
      tags: article.tags,
    });
  }
}
