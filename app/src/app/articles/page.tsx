import { ArticleIndex } from "@/features/article/views/ArticleIndex";

export const generateMetadata = () => {
	return {
		title: "記事一覧",
		description: "記事の一覧です。",
	};
};

export default function ArticleIndexPage() {
	return <ArticleIndex />;
}
