import type { RootContentMap } from "mdast";
import type { FC } from "react";
import classes from "./InlineCodeNode.module.scss";

export const InlineCodeNode: FC<{ node: RootContentMap["inlineCode"] }> = ({
	node,
}) => {
	return <code className={classes.inlineCode}>{node.value}</code>;
};
