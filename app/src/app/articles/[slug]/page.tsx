import { ArticleHeader } from "@/features/article/components/ArticleHeader";
import { getMarkdownContent } from "@/features/article/utils/getMarkdownContent";
import { MarkdownRenderer } from "@packages/markdown-render";

type Props = {
	params: Promise<{
		slug: string;
	}>;
};

export default async function ArticlePage({ params }: Props) {
	const { slug } = await params;
	const { content, metadata } = getMarkdownContent(slug);

	return (
		<article>
			<ArticleHeader title={metadata.title} publishedAt={metadata.publishedAt} updatedAt={metadata.updatedAt} />
			<MarkdownRenderer>{content}</MarkdownRenderer>
		</article>
	);
}
