import { SectionTitle } from "@/components/shared/SectionTitle/SectionTitle";
import type { FC } from "react";
import { ArticleList } from "../../components/ArticleList";

export const ArticleIndex: FC = () => {
	return (
		<section>
			<SectionTitle>Article</SectionTitle>
			<ArticleList />
		</section>
	);
};
