import type { FC } from "react";
import styles from "./SkeletonRect.module.scss";

type Props = {
	width?: number | string;
	height?: number | string;
};

export const SkeletonRect: FC<Props> = ({ width, height }) => {
	return (
		<span
			className={styles.skeleton__rect}
			style={{
				width: width,
				height: height,
			}}
		/>
	);
};
