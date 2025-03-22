import { Skeleton } from "@packages/shared-components";
import type { FC } from "react";
import styles from "./ArticleSkeleton.module.scss";

export const ArticleSkeleton: FC = () => {
	return (
		<div
			className={styles.articleSkeleton}
			role="progressbar"
			aria-valuenow={50}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-busy="true"
			tabIndex={0}
			aria-label="記事取得中"
		>
			<Skeleton variant="text" />
			<Skeleton variant="text" width="80%" />
			<Skeleton variant="text" width="40%" />
			<Skeleton variant="text" width="90%" />
			<Skeleton variant="rect" width="100%" height={300} />
		</div>
	);
};
