import { ArticleDetailDto } from "../../domain/dto/ArticleDetailDto";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export class GetArticleUseCase {
  constructor(private repository: IArticleRepository) { }

  async execute(slug: string): Promise<ArticleDetailDto | null> {
    const article = await this.repository.getArticle(slug);
    return article ? ArticleDetailDto.createFromArticle(article) : null;
  }
}
