import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { ImageNodeClient } from "./ImageNodeClient";

export const ImageNode: FC<{ node: RootContentMap["image"] }> = ({ node }) => {
	return <ImageNodeClient node={node} />;
};
