import type { Context } from "hono";
import type { GetArticleUseCase } from "../../app/usecase/GetArticleUseCase";

export const getArticleHandler = async (
	ctx: Context,
	useCase: GetArticleUseCase,
) => {
	const slug = ctx.req.param("slug");
	const article = await useCase.execute(slug);

	if (!article) {
		return ctx.json(
			{
				error: "Article not found",
			},
			404,
		);
	}

	return ctx.json(article);
};
