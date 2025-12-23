import Link from "next/link";
import type { FC } from "react";
import styles from "./Footer.module.scss";

const links = [
	{ label: "記事一覧", href: "/articles", external: false },
	{ label: "Zennの一覧", href: "/zenn", external: false },
	{
		label: "Github",
		href: "https://github.com/okm321/okmkm-blog",
		external: true,
	},
];

export const Footer: FC = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.topRow}>
					<div className={styles.brandBlock}>
						<span className={styles.brand}>okmkm.log</span>
					</div>
					<ul className={styles.links}>
						{links.map((link) => (
							<li key={link.label}>
								{link.external ? (
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer noopener"
										className={styles.link}
									>
										<span className={styles.linkLabel}>
											{link.label}
											<span
												className={styles.externalIcon}
												aria-hidden="true"
											/>
										</span>
									</a>
								) : (
									<Link href={link.href} className={styles.link}>
										{link.label}
									</Link>
								)}
							</li>
						))}
					</ul>
				</div>
				<p className={styles.copy}>© 2025 okmkm. All rights reserved.</p>
			</div>
		</footer>
	);
};
