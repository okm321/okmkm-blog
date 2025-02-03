import type { FC } from "react";
import styles from "./ArticleSkeleton.module.scss";
import { Skeleton } from "@/components/shared/Skeleton/Skeleton";

export const ArticleSkeleton: FC = () => {
	return (
		<div className={styles.articleSkeleton}>
			<Skeleton variant="text" />
			<Skeleton variant="text" width="80%" />
			<Skeleton variant="text" width="40%" />
			<Skeleton variant="text" width="90%" />
			<Skeleton variant="rect" width="100%" height={300} />
		</div>
	);
};
