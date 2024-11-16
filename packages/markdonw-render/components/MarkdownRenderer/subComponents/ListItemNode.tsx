import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const ListItemNode: FC<{ node: RootContentMap["listItem"] }> = ({
	node,
}) => {
	if (node.children.length === 1 && node.children[0].type === "paragraph") {
		return (
			<li>
				<NodesRenderer nodes={node.children[0].children} />
			</li>
		);
	}

	return (
		<li>
			<NodesRenderer nodes={node.children} />
		</li>
	);
};
