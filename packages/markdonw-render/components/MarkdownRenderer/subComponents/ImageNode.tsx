import type { RootContentMap } from "mdast";
import type { FC } from "react";
import classes from "./ImageNode.module.scss";

export const ImageNode: FC<{ node: RootContentMap["image"] }> = ({ node }) => {
	return (
		<a href={node.url} target="_blank" rel="noreferrer">
			<img src={node.url} alt={node.alt ?? ""} className={classes.img} />
		</a>
	);
};
