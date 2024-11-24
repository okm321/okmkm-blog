import type { FC } from "react";
import NextLink from "next/link";
import Image from "next/image";
import classes from "./ArticleCard.module.scss";
import { formatDate } from "@packages/utils";
import { Heading } from "@/components/shared/Heading";

type Props = {
	/** 記事タイトル */
	title: string;
	/** 記事の公開日 */
	publishedAt: string;
	/** 記事のslug */
	slug: string;
};

export const ArticleCard: FC<Props> = ({ title, publishedAt, slug }) => {
	return (
		<article className={classes.articleCard}>
			<Heading level={2} className="var(--font_rubik_doodle_shadow)">
				<NextLink href={`/articles/${slug}`} className={classes.link}>
					<Image
						width={1200}
						height={630}
						src={`/articles/${slug}/opengraph-image`}
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
