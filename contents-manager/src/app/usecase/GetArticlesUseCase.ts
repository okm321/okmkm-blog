import { ArticleListDto } from "../../domain/dto/ArticleListDto";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";

export class GetArticlesUseCase {
	constructor(private repository: IArticleRepository) {}

	async execute(): Promise<ArticleListDto[]> {
		const articles = await this.repository.getArticles();
		const sortedArticles = articles.sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
		);

		return articles.map((article) => ArticleListDto.createFromArticle(article));
	}
}
