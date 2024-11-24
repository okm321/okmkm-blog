import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import classes from "./Heading.module.scss";

type Props = PropsWithChildren<{
	/** 見出しレベル */
	level: 1 | 2 | 3 | 4 | 5 | 6;
}> &
	HTMLAttributes<HTMLHeadingElement>;

export const Heading: FC<Props> = ({ level = 1, children, ...props }) => {
	const Tag = `h${level}` as const;
	return <Tag {...props}>{children}</Tag>;
};
