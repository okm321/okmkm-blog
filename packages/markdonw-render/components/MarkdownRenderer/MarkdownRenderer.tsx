import type { FootnoteDefinition, Root, RootContent } from "mdast";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "../../lib/remark-link-card";
import classes from "./MarkdownRenderer.module.scss";
import { NodesRenderer } from "./subComponents/NodesRenderer";

const parseMarkdown = remark().use(remarkGfm).use(remarkLinkCard);

type Props = { children: string };

const extractFootnoteDefinitions = (
	nodes: RootContent[],
): FootnoteDefinition[] => {
	const work: FootnoteDefinition[] = [];

	for (const node of nodes) {
		if (node.type === "footnoteDefinition") {
			work.push(node);
		} else if ("children" in node) {
			work.push(...extractFootnoteDefinitions(node.children));
		}
	}

	return work;
};

export function MarkdownRenderer({ children }: Props) {
	const parsed = parseMarkdown.parse(children);
	const mdastRoot = parseMarkdown.runSync(parsed) as Root;

	// const footnoteDefinitions = extractFootnoteDefinitions(mdastRoot.children);
	//
	// return <div>{children}</div>;

	return (
		<section>
			<div id="markdown-renderer" className={classes.markdown}>
				<NodesRenderer nodes={mdastRoot.children} />
			</div>
			{/* <FootnotesSection nodes={footnoteDefinitions} /> */}
		</section>
	);
}
