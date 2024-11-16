import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const StrongNode: FC<{ node: RootContentMap["strong"] }> = ({
	node,
}) => {
	return (
		<strong>
			<NodesRenderer nodes={node.children} />
		</strong>
	);
};
