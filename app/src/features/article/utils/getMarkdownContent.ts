import path from "node:path";
import fs from "node:fs";
import matter from "gray-matter";
import removeMarkdown from "remove-markdown";
import type { MetaData } from "contents-manager/index";

const MONOREPO_ROOT = path.resolve(process.cwd(), "../");
const ARTICLES_DIR = path.join(MONOREPO_ROOT, "contents-manager/articles");

export const getMarkdownContent = (
	slug: string,
): { content: string; metadata: MetaData } => {
	const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
	const fileContents = fs.readFileSync(filePath, "utf8");

	const { content, data } = matter(fileContents);

	const plainText = removeMarkdown(content).replace(/\n/g, "").trim();
	const description =
		plainText.length > 100 ? `${plainText.slice(0, 100)}...` : plainText;

	const metadata: MetaData = {
		title: data.title,
		publishedAt: data.publishedAt,
		updatedAt: data.updatedAt,
		description,
	};

	return { content, metadata };
};
