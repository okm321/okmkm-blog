import type { Context } from "hono";
import type { GetArticlesUseCase } from "../../app/usecase/GetArticlesUseCase";

export const getArticlesHandler = async (
	ctx: Context,
	useCase: GetArticlesUseCase,
) => {
	const articles = await useCase.execute();
	return ctx.json(articles);
};
