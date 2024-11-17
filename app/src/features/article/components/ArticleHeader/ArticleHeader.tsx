import type { FC } from "react";
import classes from "./ArticleHeader.module.scss";

type Props = {
	/** 記事のタイトル */
	title: string;
	/** 公開日時 */
	publishedAt: string;
	/** 更新日時 */
	updatedAt?: string;
};

export const ArticleHeader: FC<Props> = ({ title, publishedAt, updatedAt }) => {
	return (
		<header className={classes.articleHeader}>
			<h1 className={classes.articleHeader__title}>{title}</h1>
			<time>{publishedAt}</time>
		</header>
	);
};
