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
	},
	sassOptions: {
		implementation: "sass-embedded", // sassの代わりにsass-embeddedを使用
	},
	outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;
