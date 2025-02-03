import type { FC } from "react";
import { getArticles } from "../../utils/getArticles";
import { ArticleCard } from "../ArticleCard";
import classes from "./ArticleList.module.scss";
import { BlogCard } from "../BlogCard";

export const ArticleList: FC = () => {
	const articles = getArticles();
	console.log(articles);
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
					tags={article.tags}
					publishedAt={article.publishedAt}
				/>
			))}
		</div>
	);
};
