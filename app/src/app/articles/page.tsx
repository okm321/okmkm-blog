import { ArticleIndex } from "@/features/article/views/ArticleIndex";

export const generateMetadata = () => {
	return {
		title: "ブログ一覧",
		description: "ブログ記事の一覧です。",
	};
};

export default function ArticleIndexPage() {
	return <ArticleIndex />;
}
