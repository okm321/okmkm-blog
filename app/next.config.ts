import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	sassOptions: {
		implementation: "sass-embedded", // sassの代わりにsass-embeddedを使用
	},
};

export default nextConfig;
