import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const DeleteNode: FC<{ node: RootContentMap["delete"] }> = ({
	node,
}) => {
	return (
		<del>
			<NodesRenderer nodes={node.children} />
		</del>
	);
};
