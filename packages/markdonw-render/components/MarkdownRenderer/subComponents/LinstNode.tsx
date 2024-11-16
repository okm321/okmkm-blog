import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const ListNode: FC<{ node: RootContentMap["list"] }> = ({ node }) => {
	return node.ordered ? (
		<ol>
			<NodesRenderer nodes={node.children} />
		</ol>
	) : (
		<ul>
			<NodesRenderer nodes={node.children} />
		</ul>
	);
};
