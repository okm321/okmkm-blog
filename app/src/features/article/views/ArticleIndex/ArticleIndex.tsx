import { Heading } from "@/components/shared/Heading";
import type { FC } from "react";
import { ArticleList } from "../../components/ArticleList";
import classes from "./ArticleIndex.module.scss";

export const ArticleIndex: FC = () => {
	return (
		<section className={classes.articleIndex}>
			<header className={classes.articleHeader}>
				<Heading level={2} className={classes.articleHeader__title}>
					Article
				</Heading>
			</header>
			<ArticleList />
		</section>
	);
};
