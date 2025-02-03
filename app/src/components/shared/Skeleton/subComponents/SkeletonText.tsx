import type { FC } from "react";
import styles from "./SkeletonText.module.scss";

type Props = {
	width?: number | string;
};

export const SkeletonText: FC<Props> = ({ width }) => {
	return (
		<span
			className={styles.skeleton__text}
			style={{
				width: width,
			}}
		/>
	);
};
