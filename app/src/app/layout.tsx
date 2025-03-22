import { ColorThemeProvider } from "@/providers/ColorThemeProvider";
import { Rubik_Doodle_Shadow, Noto_Sans_JP } from "next/font/google";
import "@/styles/styles.scss";
import type { Metadata } from "next";
import { Header } from "@/components/shared/Header";
import { Layout } from "@/components/shared/Layout";
import { Main } from "@/components/shared/Main";
import Script from "next/script";
import { Footer } from "@/components/shared/Footer";

const RubikDoodleShadowFont = Rubik_Doodle_Shadow({
	weight: "400",
	variable: "--font_rubik_doodle_shadow",
	subsets: ["latin"],
});

const NotoSansJPFont = Noto_Sans_JP({
	weight: ["400", "800"],
	variable: "--font_noto-sans-jp",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "okmkm.log",
		template: "%s | okmkm.log",
	},
	metadataBase: new URL("https://blog.okmkm.dev"),
	description: "webエンジニアのokmkmの技術ブログです。",
	openGraph: {
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: This is a script tag
					dangerouslySetInnerHTML={{
						__html: `!function(){const e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",t=localStorage.getItem("okmkm-blog-color-theme"),o="system"===t||null==t?e:"light"===t?"light":"dark";window.document.documentElement.dataset.colorTheme=o}();`,
					}}
				/>
				<Script
					src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
					type="module"
					crossOrigin="anonymous"
				/>
			</head>
			<body
				className={`${RubikDoodleShadowFont.variable} ${NotoSansJPFont.variable}`}
			>
				<ColorThemeProvider>
					<Layout>
						<Header />
						<Main>{children}</Main>
						<Footer />
					</Layout>
				</ColorThemeProvider>
			</body>
		</html>
	);
}
