// @ts-check
import { default as defaultConfig } from '@epic-web/config/eslint'
import * as tanstackQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import gitignore from 'eslint-config-flat-gitignore'
import pluginBoundaries from 'eslint-plugin-boundaries'

const enforceServerFnPrefix = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				"Enforce '$' prefix for variables created with createServerFn",
			category: 'Stylistic Issues',
			recommended: false,
		},
		fixable: 'code',
		schema: [],
	},
	create(context) {
		return {
			VariableDeclarator(node) {
				if (
					node.init &&
					node.init.type === 'CallExpression' &&
					node.init.callee.name === 'createServerFn'
				) {
					const variableName = node.id.name
					if (!variableName.startsWith('$')) {
						context.report({
							node: node.id,
							message:
								"Variable name created with createServerFn should start with '$'",
							fix(fixer) {
								return fixer.replaceText(node.id, '$' + variableName)
							},
						})
					}
				}
			},
		}
	},
}

export default [
	...defaultConfig,
	gitignore(),
	...pluginRouter.configs['flat/recommended'],
	{
		name: '@tanstack/query',
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'@tanstack/query': {
				rules: tanstackQuery.default.rules,
			},
		},
		rules: tanstackQuery.default.configs.recommended.rules,
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			custom: {
				rules: {
					'enforce-server-fn-prefix': enforceServerFnPrefix,
				},
			},
		},
		rules: {
			'custom/enforce-server-fn-prefix': 'error',
		},
	},
	// Add boundaries configuration
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			boundaries: pluginBoundaries,
		},
		settings: {
			'boundaries/include': ['src/**/*'],
			'boundaries/elements': [
				{
					mode: 'full',
					type: 'shared',
					pattern: [
						'src/components/**/*',
						'src/data/**/*',
						'src/drizzle/**/*',
						'src/hooks/**/*',
						'src/lib/**/*',
					],
				},
				{
					mode: 'full',
					type: 'feature',
					capture: ['featureName'],
					pattern: ['src/features/*/**/*'],
				},
				{
					mode: 'full',
					type: 'routes',
					capture: ['_', 'fileName'],
					pattern: ['src/routes/**/*'],
				},
				{
					mode: 'full',
					type: 'email',
					pattern: ['src/email/**/*'],
				},
				{
					mode: 'full',
					type: 'neverImport',
					pattern: ['src/*', 'src/tasks/**/*'],
				},
			],
		},
		rules: {
			'boundaries/no-unknown': 'error',
			'boundaries/no-unknown-files': 'error',
			'boundaries/element-types': [
				'error',
				{
					default: 'disallow',
					rules: [
						{
							from: ['shared'],
							allow: ['shared'],
						},
						{
							from: ['feature'],
							allow: [
								'shared',
								['feature', { featureName: '${from.featureName}' }],
							],
						},
						{
							from: ['routes', 'neverImport'],
							allow: ['shared', 'feature'],
						},
						{
							from: ['routes'],
							allow: [['routes', { fileName: '*.css' }]],
						},
					],
				},
			],
		},
	},
]
