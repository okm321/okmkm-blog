import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";

const MONOREPO_ROOT = path.resolve(process.cwd(), "../");
const ARTICLES_DIR = path.join(MONOREPO_ROOT, "contents-manager/articles");

export const getMarkdownContent = (slug: string) => {
	const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
	const fileContents = fs.readFileSync(filePath, "utf8");

	const { content, data } = matter(fileContents);

	return { content, metadata: data };
};
