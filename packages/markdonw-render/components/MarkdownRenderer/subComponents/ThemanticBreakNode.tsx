import type { RootContentMap } from "mdast";
import type { FC } from "react";

export const ThemanticBreakNode: FC<{
	node: RootContentMap["thematicBreak"];
}> = () => {
	return <hr />;
};
