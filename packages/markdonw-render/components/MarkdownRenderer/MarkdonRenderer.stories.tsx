import type { StoryObj, Meta } from "@storybook/react";

import { MarkdownRenderer } from "./MarkdownRenderer";
import { Suspense } from "react";

const meta: Meta<typeof MarkdownRenderer> = {
	title: "MarkdownRenderer",
	component: MarkdownRenderer,
};

export default meta;

type Story = StoryObj<typeof MarkdownRenderer>;

export const Base: Story = {
	args: {
		children: `
# Hello, world!
`,
	},
};
