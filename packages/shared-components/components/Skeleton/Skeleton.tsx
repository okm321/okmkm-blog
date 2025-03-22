import type { FC } from "react";
import { SkeletonRect } from "./subComponents/SkeletonRect";
import { SkeletonText } from "./subComponents/SkeletonText";

type Props = {
	width?: number | string;
	height?: number | string;
	variant: "text" | "rect";
};

export const Skeleton: FC<Props> = ({ width, height, variant }) => {
	switch (variant) {
		case "text":
			return <SkeletonText width={width} />;
		case "rect":
			return <SkeletonRect width={width} height={height} />;
	}
};
