import type { RootContent } from "mdast";
import type { FC } from "react";
import { HeadingNode } from "./HeadingNode";
import { TextNode } from "./TextNode";
import { ParagraphNode } from "./ParagraphNode";
import { InlineCodeNode } from "./InlineCodeNode";
import { BlockQuoteNode } from "./BlockQuoteNode";
import { LinkNode } from "./LinkNode";
import { ListNode } from "./LinstNode";
import { ListItemNode } from "./ListItemNode";
import { StrongNode } from "./StrongNode";
import { ImageNode } from "./ImageNode";
import { DeleteNode } from "./DeleteNode";
import { TableNode } from "./TableNode";
import { ThemanticBreakNode } from "./ThemanticBreakNode";
import { HTMLNode } from "./HTMLNode";
import { CodeNode } from "./CodeNode";

export const NodesRenderer: FC<{ nodes: RootContent[] }> = ({ nodes }) => {
	return nodes.map((node, index) => {
		switch (node.type) {
			case "heading": {
				return <HeadingNode key={`${node.type}-${index}`} node={node} />;
			}
			case "text": {
				return <TextNode key={`${node.type}-${index}`} node={node} />;
			}
			case "paragraph": {
				return <ParagraphNode key={`${node.type}-${index}`} node={node} />;
			}
			case "inlineCode": {
				return <InlineCodeNode key={`${node.type}-${index}`} node={node} />;
			}
			case "blockquote": {
				return <BlockQuoteNode key={`${node.type}-${index}`} node={node} />;
			}
			case "link": {
				return <LinkNode key={`${node.type}-${index}`} node={node} />;
			}
			case "list": {
				return <ListNode key={`${node.type}-${index}`} node={node} />;
			}
			case "listItem": {
				return <ListItemNode key={`${node.type}-${index}`} node={node} />;
			}
			case "strong": {
				return <StrongNode key={`${node.type}-${index}`} node={node} />;
			}
			case "image": {
				return <ImageNode key={`${node.type}-${index}`} node={node} />;
			}
			case "code": {
				// @ts-ignore Server Component
				return <CodeNode key={`${node.type}-${index}`} node={node} />;
			}
			case "delete": {
				return <DeleteNode key={`${node.type}-${index}`} node={node} />;
			}
			case "table": {
				return <TableNode key={`${node.type}-${index}`} node={node} />;
			}
			case "thematicBreak": {
				return <ThemanticBreakNode key={`${node.type}-${index}`} node={node} />;
			}
			case "html": {
				return <HTMLNode key={`${node.type}-${index}`} node={node} />;
			}
			default: {
				if (process.env.NODE_ENV === "development") {
					return (
						<div key={`${node.type}-${index}`}>
							<p style={{ color: "red" }}>Unknown node type: {node.type}</p>
							<pre>{JSON.stringify(node, null, 2)}</pre>
						</div>
					);
				}
				throw new Error(`Unknown node type: ${node.type}`);
			}
		}
	});
};
