import { Hono } from "hono";
import { GetArticleUseCase } from "../../app/usecase/GetArticleUseCase";
import { GetArticlesUseCase } from "../../app/usecase/GetArticlesUseCase";
import { FileArticleRepository } from "../../infrastructure/file/FileArticleRepository";
import { getArticleHandler } from "../handlers/getArticleHandler";
import { getArticlesHandler } from "../handlers/getArticlesHandler";

const app = new Hono();
const repository = new FileArticleRepository();
const getArticlesUseCase = new GetArticlesUseCase(repository);
const getArticleUseCase = new GetArticleUseCase(repository);

// 記事一覧取得
app.get("/", async (ctx) => getArticlesHandler(ctx, getArticlesUseCase));
// 記事詳細取得
app.get("/:slug", async (ctx) => getArticleHandler(ctx, getArticleUseCase));

export default app;
