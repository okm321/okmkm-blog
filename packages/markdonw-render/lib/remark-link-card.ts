import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkLinkCard: Plugin<[], Root> = () => {
	return (tree: Root) => {
		visit(tree, "paragraph", (node, index, parent) => {
			const linkish = node.children[0];

			if (node.children.length !== 1) return;
			if (linkish.type !== "link") return;
			if (linkish.children.length !== 1) return;

			const isPlainLink =
				linkish.children[0].type === "text" &&
				linkish.url === linkish.children[0].value;
			if (!isPlainLink) return;

			if (!parent || index === undefined) return;

			parent.children[index] = {
				type: "link-card",
				url: linkish.url,
			};
		});
	};
};

declare module "mdast" {
	export interface LinkCard extends Resource {
		type: "link-card";
	}

	interface RootContentMap {
		"link-card": LinkCard;
	}
}
