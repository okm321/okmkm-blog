import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const BlockQuoteNode: FC<{ node: RootContentMap["blockquote"] }> = ({
	node,
}) => {
	return (
		<blockquote>
			<NodesRenderer nodes={node.children} />
		</blockquote>
	);
};
