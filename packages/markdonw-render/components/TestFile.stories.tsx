import type { Meta, StoryObj } from "@storybook/react";

import { TestFile } from "./TestFile";

const meta: Meta<typeof TestFile> = {
  component: TestFile,
  title: "TestFile",
};

export default meta;

type Story = StoryObj<typeof TestFile>;

export const Base: Story = {
  args: {},
};
