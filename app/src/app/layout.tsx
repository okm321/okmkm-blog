import { ColorThemeProvider } from "@/providers/ColorThemeProvider";
import { Figtree, Noto_Sans_JP, Rubik_Doodle_Shadow } from "next/font/google";
import "@/styles/styles.scss";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { Layout } from "@/components/shared/Layout";
import { Main } from "@/components/shared/Main";
import { Preload } from "@/components/shared/Preload";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import Script from "next/script";

const RubikDoodleShadowFont = Rubik_Doodle_Shadow({
	weight: "400",
	variable: "--font_rubik_doodle_shadow",
	subsets: ["latin"],
});

const NotoSansJPFont = Noto_Sans_JP({
	weight: ["400", "700"],
	variable: "--font_noto_sans_jp",
	subsets: ["latin"],
});

const FigtreeFont = Figtree({
	weight: ["400", "700"],
	variable: "--font_figtree",
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
				<GoogleTagManager gtmId={process.env.GTM_ID as string} />
				<Preload />
			</head>
			<body
				className={`${RubikDoodleShadowFont.variable} ${NotoSansJPFont.variable} ${FigtreeFont.variable} ${RubikDoodleShadowFont.className} ${NotoSansJPFont.className} ${FigtreeFont.className}`}
			>
				<ColorThemeProvider>
					<Layout
						header={<Header />}
						main={<Main>{children}</Main>}
						footer={<Footer />}
					/>
				</ColorThemeProvider>
			</body>
		</html>
	);
}
