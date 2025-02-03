import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";

const MONOREPO_ROOT = path.resolve(process.cwd(), "../");
const ARTICLES_DIR = path.join(MONOREPO_ROOT, "contents-manager/articles");

type Articles = Array<{
	slug: string;
	title: string;
	tags: string[];
	publishedAt: string;
}>;

export const getArticles = (): Articles => {
	const filenames = fs.readdirSync(ARTICLES_DIR);

	const articles = filenames.map((filename) => {
		const filePath = path.join(ARTICLES_DIR, filename);
		const fileContents = fs.readFileSync(filePath, "utf8");

		const { data } = matter(fileContents);

		return {
			slug: filename.replace(/\.md$/, ""),
			title: data.title,
			tags: data.tags,
			publishedAt: data.publishedAt,
		};
	});

	return articles.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
};
