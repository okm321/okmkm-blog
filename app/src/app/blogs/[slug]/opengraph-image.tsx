import { getArticles } from "@/features/article/utils/getArticles";
import { getMarkdownContent } from "@/features/article/utils/getMarkdownContent";
import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

type Props = {
	params: Promise<{
		slug: string;
	}>;
};

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

const assetsDirectory = `${process.cwd()}/assets`;

// 静的生成のための設定を追加
export const dynamic = "force-static";

// 静的ページ生成のためのパスパラメータを生成
export async function generateStaticParams() {
	const articles = await getArticles();

	return articles.map((article) => ({
		slug: article.slug,
	}));
}

export default async function ArticleOpenGrapghImage({ params }: Props) {
	const { slug } = await params;
	const { metadata } = await getMarkdownContent(slug);

	const fontZenMaruPromise = fs.readFile(
		path.join(assetsDirectory, "ZenMaruGothic-Bold.ttf"),
	);
	const ogimageBgPromise = fs
		.readFile(path.join(assetsDirectory, "article-og-bg.png"), {
			encoding: "base64",
		})
		.then((base64) => `data:image/png;base64,${base64}`);

	return new ImageResponse(
		<div
			lang="ja-JP"
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				padding: "120px 100px 120px",
				position: "relative",
			}}
		>
			<img
				alt=""
				src={await ogimageBgPromise}
				width={1200}
				height={630}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
				}}
			/>
			<div
				style={{
					display: "flex",
					fontFamily: "ZenMaru",
					fontSize: 56,
					fontWeight: "bold",
					lineHeight: 1.2,
					letterSpacing: "-0.01em",
					color: "#f8f8f8",
					width: "100%",
					maxHeight: "100%",
					overflow: "hidden",
				}}
			>
				{metadata.title}
			</div>
		</div>,
		{
			...size,
			fonts: [
				{
					name: "ZenMaru",
					data: await fontZenMaruPromise,
					style: "normal",
					weight: 700,
				},
			],
		},
	);
}
