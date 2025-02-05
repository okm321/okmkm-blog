import { Hono } from "hono";
import { getArticlesHandler } from "../handlers/getArticlesHandler";
import { FileArticleRepository } from "../../infrastructure/file/FileArticleRepository";
import { GetArticlesUseCase } from "../../app/usecase/GetArticlesUseCase";
import { GetArticleUseCase } from "../../app/usecase/GetArticleUseCase";
import { getArticleHandler } from "../handlers/getArticleHandler";

const app = new Hono();
const repository = new FileArticleRepository();
const getArticlesUseCase = new GetArticlesUseCase(repository);
const getArticleUseCase = new GetArticleUseCase(repository);

// 記事一覧取得
app.get("/", async (ctx) => getArticlesHandler(ctx, getArticlesUseCase));
// 記事詳細取得
app.get("/:slug", async (ctx) => getArticleHandler(ctx, getArticleUseCase));

export default app;
