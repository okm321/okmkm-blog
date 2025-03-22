import type { FC } from "react";
import styles from "./Footer.module.scss";

export const Footer: FC = () => {
	return (
		<footer className={styles.footer}>
			© 2025 okmkm. All rights reserved.
		</footer>
	);
};
