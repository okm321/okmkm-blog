import { Heading } from "@/components/shared/Heading";
import { formatDate } from "@packages/utils";
import NextLink from "next/link";
import type { FC } from "react";
import classes from "./BlogCard.module.scss";

type Props = {
	/** 記事タイトル */
	title: string;
	/** 記事の公開日 */
	publishedAt: string;
	/** 記事のslug */
	slug: string;
	/** 記事のタグ */
	tags: string[];
};

export const BlogCard: FC<Props> = ({ title, publishedAt, slug, tags }) => {
	return (
		<article className={classes.blogCard}>
			<Heading level={2}>
				<NextLink href={`/blogs/${slug}`} className={classes.link}>
					<span className={classes.cardTitle}>{title}</span>
				</NextLink>
			</Heading>
			<div className={classes.metadata}>
				<ul className={classes.tagList}>
					{tags.map((tag) => {
						return (
							<li key={tag} className={classes.tag}>
								{tag}
							</li>
						);
					})}
				</ul>
				<time>{formatDate(publishedAt, "yyyy/MM/dd")}</time>
			</div>
		</article>
	);
};
