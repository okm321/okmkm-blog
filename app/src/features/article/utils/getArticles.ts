import { customFetch } from "@/api/customFetch";
import type { ArticleListDto } from "contents-manager/index";

export const getArticles = async (): Promise<ArticleListDto[]> => {
	const articles = await customFetch<ArticleListDto[]>("/api/articles");

	return articles;
};
