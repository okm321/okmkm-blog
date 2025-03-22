import { customFetch } from "@/api/customFetch";
import type { ArticleDetailDto, MetaData } from "contents-manager/index";
import removeMarkdown from "remove-markdown";

export const getMarkdownContent = async (
	slug: string,
): Promise<{ content: string; metadata: MetaData }> => {
	const article = await customFetch<ArticleDetailDto>(`/api/articles/${slug}`);

	const plainText = removeMarkdown(article.body).replace(/\n/g, "").trim();
	const description =
		plainText.length > 100 ? `${plainText.slice(0, 100)}...` : plainText;

	const metadata: MetaData = {
		title: article.title,
		publishedAt: article.publishedAt,
		updatedAt: article.updatedAt,
		description,
	};

	return { content: article.body, metadata };
};
