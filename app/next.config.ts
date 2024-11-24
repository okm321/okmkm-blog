import type { NextConfig } from "next";

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
};

export default nextConfig;
