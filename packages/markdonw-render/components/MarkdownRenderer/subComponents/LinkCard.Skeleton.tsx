import { Skeleton } from "@packages/shared-components";
import type { FC } from "react";
import styles from "./LinkCardSkeleton.module.scss";

export const LinkCardSkeleton: FC = () => {
	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={50}
			aria-label="リンクカード読み込み中"
			tabIndex={0}
			className={styles.linkCardSkeleton}
		>
			<Skeleton variant="rect" height={135} />
		</div>
	);
};
