import type { FC } from "react";
import { getZennArticles } from "../../api/getZennArticles";
import { ZennCard } from "../ZennCard";
import classes from "./ZennList.module.scss";

export const ZennList: FC = async () => {
	const zennArticles = await getZennArticles();
	return (
		<div className={classes.zennList}>
			{zennArticles.map((article) => (
				<ZennCard
					key={article.guid}
					title={article.title}
					link={article.link}
					publishedAt={article.pubDate}
					thumbnail={article.thumbnail}
				/>
			))}
		</div>
	);
};
