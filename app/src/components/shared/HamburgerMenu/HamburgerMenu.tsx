"use client";

import NextLink from "next/link";
import {
	type FC,
	type ReactNode,
	type SVGProps,
	useEffect,
	useRef,
	useState,
} from "react";
import classes from "./HamburgerMenu.module.scss";

type Navigation = {
	title: string;
	path: string;
	icon: ReactNode;
	isExternal?: boolean;
};

const NavigationList: Navigation[] = [
	{
		title: "記事一覧",
		path: "/articles",
		icon: (
			<ArticleIcon
				fontSize="1.5rem"
				aria-hidden="true"
				className={classes.navIcon}
			/>
		),
	},
	{
		title: "zennの一覧",
		path: "/zenn",
		icon: (
			<ZennIcon
				fontSize="1.5rem"
				aria-hidden="true"
				className={classes.navIcon}
			/>
		),
	},
	{
		title: "Github",
		path: "https://github.com/okm321/okmkm-blog",
		isExternal: true,
		icon: <GithubIcon fontSize="1.5rem" className={classes.navIcon} />,
	},
];

export const HamburgerMenu: FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	// メニュー外クリックとESCキー押下でメニューを閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscKey);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [isOpen]);

	return (
		<nav className={classes.hamburgerMenu} ref={menuRef}>
			<button
				className={`${classes.mahjongButton} ${isOpen ? classes.active : ""}`}
				type="button"
				onClick={toggleMenu}
				aria-expanded={isOpen}
				aria-label="メニューを開く"
			>
				<span className={classes.hamburgerMenuImg} />
			</button>

			{isOpen && (
				<div className={classes.menuPopup}>
					<ul className={classes.menuList}>
						{NavigationList.map((nav) => {
							return (
								<li className={classes.menuItem} key={nav.title}>
									{!nav.isExternal ? (
										<NextLink
											href={nav.path}
											aria-label={nav.title}
											className={classes.menuLink}
											onClick={() => {
												setIsOpen(false);
											}}
										>
											{nav.icon}
											<span>{nav.title}</span>
										</NextLink>
									) : (
										<a
											href={nav.path}
											aria-label={nav.title}
											className={classes.menuLink}
											target="_blank"
											rel="noopener noreferrer"
										>
											{nav.icon}
											<span>{nav.title}</span>
										</a>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</nav>
	);
};

export function ArticleIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 32 32"
			{...props}
		>
			<title>Article</title>
			<path
				fill="currentColor"
				d="M4 24h10v2H4zm0-6h10v2H4zm22-4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M6 6v6h20V6zm20 22h-6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2m-6-8v6h6v-6z"
			/>
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
