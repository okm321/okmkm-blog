import type { RootContent } from "mdast";
import { type FC, Suspense } from "react";
import { BlockQuoteNode } from "./BlockQuoteNode";
import { CodeNode } from "./CodeNode";
import { DeleteNode } from "./DeleteNode";
import { HTMLNode } from "./HTMLNode";
import { HeadingNode } from "./HeadingNode";
import { ImageNode } from "./ImageNode";
import { InlineCodeNode } from "./InlineCodeNode";
import { LinkCard } from "./LinkCard";
import { LinkCardSkeleton } from "./LinkCard.Skeleton";
import { LinkNode } from "./LinkNode";
import { ListNode } from "./LinstNode";
import { ListItemNode } from "./ListItemNode";
import { ParagraphNode } from "./ParagraphNode";
import { StrongNode } from "./StrongNode";
import { TableNode } from "./TableNode";
import { TextNode } from "./TextNode";
import { ThemanticBreakNode } from "./ThemanticBreakNode";

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
			// case "link-card": {
			// 	//  @ts-ignore Server Component
			// 	return <LinkCard key={`${node.type}-${index}`} node={node} />;
			// }
			case "link-card": {
				return (
					<Suspense fallback={<LinkCardSkeleton />}>
						{/* @ts-ignore Server Component */}
						<LinkCard key={`${node.type}-${index}`} node={node} />
					</Suspense>
				);
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
