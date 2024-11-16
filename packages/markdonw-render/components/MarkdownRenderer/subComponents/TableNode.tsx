import type { RootContentMap } from "mdast";
import type { FC } from "react";
import { NodesRenderer } from "./NodesRenderer";

export const TableNode: FC<{ node: RootContentMap["table"] }> = ({ node }) => {
	const [headRow, ...bodyRows] = node.children;
	return (
		<table>
			<thead>
				<tr>
					{headRow.children.map((cell, index) => (
						<th
							key={`${cell.type}-${index}`}
							style={{ textAlign: node.align?.[index] ?? undefined }}
						>
							<NodesRenderer nodes={cell.children} />
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{bodyRows.map((row, index) => (
					<tr key={`${row.type}-${index}`}>
						{row.children.map((cell, index) => (
							<td
								key={`${cell.type}-${index}`}
								style={{ textAlign: node.align?.[index] ?? undefined }}
							>
								<NodesRenderer nodes={cell.children} />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
