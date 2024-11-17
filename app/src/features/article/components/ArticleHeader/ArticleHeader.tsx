import type { FC } from "react";
import classes from "./ArticleHeader.module.scss";
import { formatDate } from "@packages/utils";

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
			<div className={classes.articleHeader__date}>
				<p className={classes["articleHeader__date--text"]}>
					<time dateTime={formatDate(publishedAt, "yyyy-MM-dd")}>
						{formatDate(publishedAt, "yyyy年MM月dd日")}
					</time>
					に公開
				</p>
				{updatedAt && (
					<p className={classes["articleHeader__date--text"]}>
						<time dateTime={formatDate(updatedAt, "yyyy-MM-dd")}>
							{formatDate(updatedAt, "yyyy年MM月dd日")}
						</time>
						に更新
					</p>
				)}
			</div>
		</header>
	);
};
