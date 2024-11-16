import { MarkdownRenderer } from "@packages/markdown-render";

const test = `
# H1 test
## H2 test
### H3 test
#### H4 test
##### H5 test
###### H6 test
`;

export default function Home() {
	return <MarkdownRenderer>{test}</MarkdownRenderer>;
}
