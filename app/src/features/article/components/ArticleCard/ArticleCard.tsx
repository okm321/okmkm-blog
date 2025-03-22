import { Heading } from "@/components/shared/Heading";
import { formatDate } from "@packages/utils";
import Image from "next/image";
import NextLink from "next/link";
import type { FC } from "react";
import classes from "./ArticleCard.module.scss";

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

export const ArticleCard: FC<Props> = ({ title, publishedAt, slug, tags }) => {
	return (
		<article className={classes.articleCard}>
			<Heading level={2} className="var(--font_rubik_doodle_shadow)">
				<NextLink href={`/blogs/${slug}`} className={classes.link}>
					<Image
						width={1200}
						height={630}
						src={`/blogs/${slug}/opengraph-image`}
						alt=""
						style={{
							maxWidth: "100%",
							height: "auto",
						}}
					/>
				</NextLink>
				<span className="visually-hidden">{title}</span>
			</Heading>
			<div className={classes.metadata}>
				<time>{formatDate(publishedAt, "yyyy/MM/dd")}</time>
			</div>
		</article>
	);
};
