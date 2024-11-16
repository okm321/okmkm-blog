import type { RootContentMap } from "mdast";
import type { FC } from "react";

export const HTMLNode: FC<{ node: RootContentMap["html"] }> = ({ node }) => {
	return node.value;
};
