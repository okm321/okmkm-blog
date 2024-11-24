import type { FC } from "react";
import { getArticles } from "../../utils/getArticles";
import { ArticleCard } from "../ArticleCard";
import classes from "./ArticleList.module.scss";

export const ArticleList: FC = () => {
	const articles = getArticles();
	return (
		<div className={classes.articleList}>
			{articles.map((article) => (
				<ArticleCard
					key={article.slug}
					title={article.title}
					slug={article.slug}
					publishedAt={article.publishedAt}
				/>
			))}
		</div>
	);
};
