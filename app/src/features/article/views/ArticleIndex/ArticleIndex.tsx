import type { FC } from "react";
import { ArticleList } from "../../components/ArticleList";
import { SectionTitle } from "@/components/shared/SectionTitle/SectionTitle";

export const ArticleIndex: FC = () => {
	return (
		<section>
			<SectionTitle>Blog</SectionTitle>
			<ArticleList />
		</section>
	);
};
