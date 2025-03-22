import type { FC } from "react";
import { getArticles } from "../../utils/getArticles";
import { BlogCard } from "../BlogCard";
import classes from "./ArticleList.module.scss";

export const ArticleList: FC = async () => {
	const articles = await getArticles();

	return (
		<div className={classes.articleList}>
			{articles.map((article) => (
				// <ArticleCard
				// 	key={article.slug}
				// 	title={article.title}
				// 	slug={article.slug}
				// 	tags={article.tags}
				// 	publishedAt={article.publishedAt}
				// />
				<BlogCard
					key={article.slug}
					title={article.title}
					slug={article.slug}
					tags={article.tags ?? []}
					publishedAt={article.publishedAt}
				/>
			))}
		</div>
	);
};
