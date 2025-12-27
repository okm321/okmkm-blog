import { ZennIndex } from "@/features/zenn/views/ZennIndex";
import type { Metadata } from "next";
import type { FC } from "react";

export const generateMetadata = (): Metadata => {
	return {
		title: "zennの記事一覧",
		description: "zennにあげた記事の一覧です。",
	};
};

const ZennArticlsePage: FC = () => {
	return <ZennIndex />;
};

export default ZennArticlsePage;
