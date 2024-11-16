import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";
import classes from "./LinkNode.module.scss";

export const LinkNode: FC<{ node: RootContentMap["link"] }> = ({ node }) => {
	return (
		<a
			className={classes.textLink}
			href={node.url}
			target="_blank"
			rel="noreferrer"
		>
			<NodesRenderer nodes={node.children} />
		</a>
	);
};
