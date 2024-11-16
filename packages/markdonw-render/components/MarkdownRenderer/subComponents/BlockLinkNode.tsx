import type { RootContentMap } from "mdast";
import type { FC } from "react";

export const BlockLinkNode: FC<{ node: RootContentMap["block-link"] }> = ({
	node,
}) => {
	return (
		<div className={classes.embeded}>
			<RichLinkCard href={node.url} isExternal />
		</div>
	);
};
