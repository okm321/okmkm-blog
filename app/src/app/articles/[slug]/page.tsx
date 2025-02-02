import { ArticleHeader } from "@/features/article/components/ArticleHeader";
import { getMarkdownContent } from "@/features/article/utils/getMarkdownContent";
import { MarkdownRenderer } from "@packages/markdown-render";
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
	const article = getMarkdownContent(slug);

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

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params;
	const { content, metadata } = getMarkdownContent(slug);

	return (
		<article>
			<ArticleHeader
				title={metadata.title}
				publishedAt={metadata.publishedAt}
				updatedAt={metadata.updatedAt}
			/>
			<MarkdownRenderer>{content}</MarkdownRenderer>
		</article>
	);
}
