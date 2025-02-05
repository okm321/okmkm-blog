import type { Article } from "../entities/Article";

export interface IArticleRepository {
  getArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
}
