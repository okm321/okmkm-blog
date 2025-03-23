import { getArticles } from "@/features/article/utils/getArticles";
import { getMarkdownContent } from "@/features/article/utils/getMarkdownContent";
import { ArticleDetailView } from "@/features/article/views/ArticleDetailView/ArticleDetailView";
import type { Metadata } from "next";

type Props = {
	params: Promise<{
		slug: string;
	}>;
};

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	const { slug } = await params;
	const article = await getMarkdownContent(slug);

	return {
		title: article.metadata.title,
		description: article.metadata.description,
		openGraph: {
			type: "article",
			url: `/articles/${slug}`,
			title: article.metadata.title,
			description: article.metadata.description,
			publishedTime: article.metadata.publishedAt,
			modifiedTime: article.metadata.updatedAt,
			// tags: article.metadata.tags,
		},
	};
};

export const generateStaticParams = async () => {
	const articles = await getArticles();

	return articles.map((article) => ({
		slug: article.slug,
	}));
};

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params;

	return <ArticleDetailView slug={slug} />;
}
