import fs from "fs-extra";
import path from "node:path";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import { Article } from "../../domain/entities/Article";
import matter from "gray-matter";

export class FileArticleRepository implements IArticleRepository {
  async getArticles(): Promise<Article[]> {
    const dir = path.join(process.cwd(), "articles");
    const files = await fs.readdir(dir);

    return await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const { data } = matter(content);

        return Article.create({
          slug: file.replace(/\.md$/, ""),
          title: data.title,
          publishedAt: data.publishedAt,
          tags: data.tags ?? [],
        });
      }),
    );
  }

  async getArticle(slug: string): Promise<Article | null> {
    const filePath = path.join(process.cwd(), "articles", `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = await fs.readFile(filePath, "utf-8");
    const { data, content: body } = matter(content);

    return Article.create({
      slug,
      title: data.title,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      body,
      tags: data.tags ?? [],
    });
  }
}
