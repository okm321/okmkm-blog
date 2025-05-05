import {
	transformerNotationDiff,
	transformerNotationHighlight,
} from "@shikijs/transformers";
import type { RootContentMap } from "mdast";
import { codeToHtml } from "shiki";
import classes from "./CodeNode.module.scss";

async function highlightWithShiki(
	code: string,
	lang: string,
	filename: string | null,
): Promise<string> {
	return codeToHtml(code, {
		lang,
		theme: "nord",
		transformers: [
			transformerNotationDiff(),
			transformerNotationHighlight(),
			{
				pre: (el) => {
					if (filename != null) {
						el.properties["data-filename"] = filename;
					}
				},
			},
		],
	});
}

function getFilenameFromMeta(meta: string | null | undefined): string | null {
	if (!meta) {
		return null;
	}

	const match = meta.match(/filename=(\S+)/);
	return match ? match[1] : null;
}

export async function CodeNode({ node }: { node: RootContentMap["code"] }) {
	const lang = node.lang ?? "";
	const filename = getFilenameFromMeta(node.meta);
	const highlightedCode = await highlightWithShiki(node.value, lang, filename);

	return (
		<figure className={classes.codeBlock}>
			{filename && <figcaption>{filename}</figcaption>}
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: This is a script tag
				dangerouslySetInnerHTML={{ __html: highlightedCode }}
			/>
		</figure>
	);
}
