import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const ParagraphNode: FC<{ node: RootContentMap["paragraph"] }> = ({
	node,
}) => {
	return (
		<p>
			<NodesRenderer nodes={node.children} />
		</p>
	);
};
