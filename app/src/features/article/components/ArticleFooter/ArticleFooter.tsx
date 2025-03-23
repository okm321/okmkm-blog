import NextLink from "next/link";
import type { FC } from "react";
import styles from "./ArticleFooter.module.scss";
import { LinkList } from "./subComponents/LinkList";

type Props = {
	/** 記事URL */
	url: string;
	/** 記事タイトル */
	title: string;
};

export const ArticleFooter: FC<Props> = ({ url, title }) => {
	return (
		<div className={styles.articleFooter}>
			<hr className={styles.articleFooter__hr} />
			<div className={styles.articleFooter__links}>
				<NextLink href="/articles">記事一覧に戻る</NextLink>
				<LinkList url={url} title={title} />
			</div>
		</div>
	);
};
