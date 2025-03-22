import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/zenn/image/upload/**",
			},
		],
		unoptimized: true,
	},
	sassOptions: {
		implementation: "sass-embedded", // sassの代わりにsass-embeddedを使用
	},
	outputFileTracingRoot: path.join(__dirname, ".."),
	outputFileTracingIncludes: {
		"/blogs/[slug]/opengraph-image": [
			path.join("..", "contents-manager", "articles", "**/*"),
			path.join("..", "contents-manager", "images", "**/*"),
		],
	},
	output: "export",
};

export default nextConfig;
