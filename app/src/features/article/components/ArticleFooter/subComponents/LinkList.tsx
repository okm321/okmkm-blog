import type { FC, SVGProps } from "react";
import styles from "./LinkList.module.scss";

type Props = {
	/** 記事URL */
	url: string;
	/** 記事タイトル */
	title: string;
};

export const LinkList: FC<Props> = ({ url, title }) => {
	const isProduction = process.env.BASE_URL !== undefined;
	return (
		<ul className={styles.linkList}>
			<li className={styles.linkItem}>
				<a
					href={
						isProduction
							? `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(`${title} | okmkm.log`)}`
							: "#"
					}
					aria-label="Twitterでシェア"
					target="_blank"
					rel="noopener noreferrer"
				>
					<SimpleIconsX fontSize="1.4rem" />
				</a>
			</li>
			<li className={styles.linkItem}>
				<a
					href={
						isProduction
							? `https://b.hatena.ne.jp/add?mode=confirm&url=${url}&title=${encodeURIComponent(`${title} | okmkm.log`)}`
							: "#"
					}
					aria-label="はてなブックマークに追加"
					target="_blank"
					rel="noopener noreferrer"
				>
					<SimpleIconsHatenabookmark fontSize="1.6rem" />
				</a>
			</li>
		</ul>
	);
};

function SimpleIconsX(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>X</title>
			<path
				fill="currentColor"
				d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584l-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
			/>
		</svg>
	);
}

function SimpleIconsHatenabookmark(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>はてなブックマーク</title>
			<path
				fill="currentColor"
				d="M20.47 0A3.53 3.53 0 0 1 24 3.53v16.94A3.53 3.53 0 0 1 20.47 24H3.53A3.53 3.53 0 0 1 0 20.47V3.53A3.53 3.53 0 0 1 3.53 0zm-3.705 14.47a1.412 1.412 0 0 0 0 2.824c.78 0 1.41-.645 1.41-1.425s-.63-1.41-1.41-1.41zM8.61 17.247c1.2 0 2.056-.042 2.58-.12c.526-.084.976-.222 1.32-.412c.45-.232.78-.564 1.02-.99s.36-.915.36-1.48q0-1.17-.63-1.87c-.42-.48-.99-.734-1.74-.794c.66-.18 1.156-.45 1.456-.81c.315-.344.465-.824.465-1.424c0-.48-.103-.885-.3-1.26a2.34 2.34 0 0 0-.883-.87c-.345-.195-.735-.315-1.215-.405c-.464-.074-1.29-.12-2.474-.12H5.654v10.486H8.61zm.736-4.185q1.058 0 1.44.262c.27.18.39.495.39.93c0 .405-.135.69-.42.855c-.27.18-.765.254-1.44.254H8.31v-2.297h1.05zm8.656.706v-7.06h-2.46v7.06H18zM8.925 9.08q1.063 0 1.432.24q.367.239.367.83q0 .569-.39.804q-.396.231-1.452.232h-.57V9.08h.615z"
			/>
		</svg>
	);
}
