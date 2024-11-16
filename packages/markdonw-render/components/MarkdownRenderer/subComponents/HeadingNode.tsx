import type { PhrasingContent, RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const HeadingNode: FC<{ node: RootContentMap["heading"] }> = ({
	node,
}) => {
	const Component = (
		{
			1: "h1",
			2: "h2",
			3: "h3",
			4: "h4",
			5: "h5",
			6: "h6",
		} as const
	)[node.depth];

	const childrenText = (function getChildrenText(
		children: PhrasingContent[],
	): string {
		return children.reduce((acc, child) => {
			if ("value" in child) {
				return acc + child.value;
			}
			if ("children" in child) {
				return acc + getChildrenText(child.children);
			}
			return acc;
		}, "");
	})(node.children);

	return (
		<Component id={encodeURIComponent(childrenText)}>
			<NodesRenderer nodes={node.children} />
		</Component>
	);
};
