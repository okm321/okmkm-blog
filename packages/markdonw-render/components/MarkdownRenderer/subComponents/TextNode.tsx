import type { RootContentMap } from "mdast";
import type { FC } from "react";

export const TextNode: FC<{ node: RootContentMap["text"] }> = ({ node }) => {
	return node.value;
};
