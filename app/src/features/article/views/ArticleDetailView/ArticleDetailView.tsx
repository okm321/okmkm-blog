import { MarkdownRenderer } from "@packages/markdown-render";
import { type FC, Suspense } from "react";
import { ArticleFooter } from "../../components/ArticleFooter";
import { ArticleHeader } from "../../components/ArticleHeader";
import { ArticleSkeleton } from "../../components/ArticleSkeleton";
import { getMarkdownContent } from "../../utils/getMarkdownContent";
import styles from "./ArticleDetailView.module.scss";

type Props = {
	slug: string;
};

export const ArticleDetailView: FC<Props> = async ({ slug }) => {
	const { content, metadata } = await getMarkdownContent(slug);
	const url = `${process.env.BASE_URL}/articles/${slug}`;

	return (
		<article className={styles.articleDetail}>
			<ArticleHeader
				title={metadata.title}
				publishedAt={metadata.publishedAt}
				updatedAt={metadata.updatedAt}
			/>
			<Suspense fallback={<ArticleSkeleton />}>
				<MarkdownRenderer>{content}</MarkdownRenderer>
			</Suspense>
			<ArticleFooter url={url} title={metadata.title} />
		</article>
	);
};
