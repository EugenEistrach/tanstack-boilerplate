import { type StorybookConfig } from '@storybook/react-vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-onboarding',
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	viteFinal: async (config) => {
		return {
			...config,
			plugins: [...(config.plugins || []), viteTsConfigPaths()],
			css: {
				postcss: {
					plugins: [require('tailwindcss'), require('autoprefixer')],
				},
			},
		}
	},
}

export default config
