// @ts-check
import { default as defaultConfig } from '@epic-web/config/eslint'
import * as tanstackQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import gitignore from 'eslint-config-flat-gitignore'

export default [
	...defaultConfig,
	gitignore(),
	...pluginRouter.configs['flat/recommended'],
	{
		name: '@tanstack/query',
		files: ['src/**/*.{ts,tsx}'],
		plugins: {
			'@tanstack/query': {
				rules: tanstackQuery.default.rules,
			},
		},
		rules: tanstackQuery.default.configs.recommended.rules,
	},
]