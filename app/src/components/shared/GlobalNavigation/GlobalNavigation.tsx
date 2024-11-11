import type { ReactNode, SVGProps } from "react";
import NextLink from "next/link";
import classes from "./GlobalNavigation.module.scss";

type Navigation = {
	title: string;
	path: string;
	icon: ReactNode;
};

const NavigationList: Navigation[] = [
	{
		title: "blog",
		path: "/#",
		icon: <BlogIcon fontSize="28px" />,
	},
	{
		title: "zenn",
		path: "/#",
		icon: <ZennIcon fontSize="28px" />,
	},
	{
		title: "Github",
		path: "/#",
		icon: <GithubIcon fontSize="28px" />,
	},
];

export const GlobalNavigation = () => {
	return (
		<nav className={classes.navigation} aria-label="グローバルナビゲーション">
			<ul className={classes.navigationList}>
				{NavigationList.map((nav) => {
					return (
						<li key={nav.title}>
							<NextLink href={nav.path}>
								<div className={classes.navigationList__item}>
									<span>{nav.icon}</span>
								</div>
							</NextLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export function BlogIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 20 20"
			{...props}
		>
			<title>Book</title>
			<g fill="currentColor">
				<path
					d="m11 5.79l7.314-1.27q.12-.02.242-.02c.801 0 1.444.664 1.444 1.475v9.786c0 .72-.511 1.34-1.213 1.456l-7.705 1.276a.5.5 0 0 1-.18-.002l-7.647-1.267A1.5 1.5 0 0 1 2 15.744V6.011a1.5 1.5 0 0 1 1.756-1.478z"
					opacity=".2"
				/>
				<path
					fillRule="evenodd"
					d="M10.08 4.304L2.244 3.019A1.5 1.5 0 0 0 .5 4.5v9.738a1.5 1.5 0 0 0 1.268 1.482l8.155 1.275a.5.5 0 0 0 .577-.494V4.797a.5.5 0 0 0-.42-.493m-8-.298L9.5 5.222v10.694L1.923 14.73a.5.5 0 0 1-.423-.493V4.5a.5.5 0 0 1 .58-.494"
					clipRule="evenodd"
				/>
				<path
					fillRule="evenodd"
					d="M18 3a1.5 1.5 0 0 0-.243.02L9.92 4.303a.5.5 0 0 0-.419.493V16.5a.5.5 0 0 0 .577.494l8.155-1.275a1.5 1.5 0 0 0 1.268-1.482V4.5A1.5 1.5 0 0 0 18 3m.077 11.73L10.5 15.917V5.222l7.42-1.216a.5.5 0 0 1 .58.494v9.737a.5.5 0 0 1-.423.493"
					clipRule="evenodd"
				/>
			</g>
		</svg>
	);
}

/**
 * https://icones.js.org/
 */
export function ZennIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Zenn</title>
			<path
				fill="currentColor"
				d="M.264 23.771h4.984a.8.8 0 0 0 .645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72a.63.63 0 0 0-.557.323L.03 23.361c-.088.176.029.41.234.41m17.181-.352l6.479-10.408a.477.477 0 0 0-.41-.733h-4.691a.52.52 0 0 0-.44.235l-6.655 10.643c-.176.264.029.616.352.616h4.779a.65.65 0 0 0 .586-.353"
			/>
		</svg>
	);
}

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Github</title>
			<g fill="none">
				<g clipPath="url(#akarIconsGithubFill0)">
					<path
						fill="currentColor"
						fillRule="evenodd"
						d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12"
						clipRule="evenodd"
					/>
				</g>
				<defs>
					<clipPath id="akarIconsGithubFill0">
						<path fill="#fff" d="M0 0h24v24H0z" />
					</clipPath>
				</defs>
			</g>
		</svg>
	);
}
