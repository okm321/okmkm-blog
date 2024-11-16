/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
	stories: [
		{
			directory: "../packages/markdonw-render",
			titlePrefix: "packages/markdown-render",
			files: "**/*.stories.@(mdx|tsx|tx)",
		},
	],
	addons: [
		"@storybook/addon-onboarding",
		"@storybook/addon-essentials",
		"@chromatic-com/storybook",
		"@storybook/addon-interactions",
	],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	features: {
		experimentalRSC: true,
	},
};
export default config;
