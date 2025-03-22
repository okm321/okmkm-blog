import type { Meta, StoryObj } from "@storybook/react";

import { MarkdownRenderer } from "./MarkdownRenderer";

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
