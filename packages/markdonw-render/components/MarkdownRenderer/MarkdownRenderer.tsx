import { remark } from "remark";
import type { RootContent, FootnoteDefinition, Root } from "mdast";
import { NodesRenderer } from "./subComponents/NodesRenderer";
import classes from "./MarkdownRenderer.module.scss";

const parseMarkdown = remark();

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

	console.log("mdastRoot:", mdastRoot);

	return (
		<div>
			<div id="markdown-renderer" className={classes.markdown}>
				<NodesRenderer nodes={mdastRoot.children} />
			</div>
			{/* <FootnotesSection nodes={footnoteDefinitions} /> */}
		</div>
	);
}
