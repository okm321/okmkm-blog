import { getMarkdownContent } from "@/features/article/utils/getMarkdownContent";
import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

const assetsDirectory = `${process.cwd()}/assets`;

export default async function NormalOpenGrapghImage() {
	const ogimageBgPromise = fs
		.readFile(path.join(assetsDirectory, "normal-og.png"), {
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
		</div>,
		{
			...size,
		},
	);
}
