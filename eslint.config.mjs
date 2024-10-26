import { default as defaultConfig } from '@epic-web/config/eslint'
import * as tanstackQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import gitignore from 'eslint-config-flat-gitignore'

import pluginBoundaries from 'eslint-plugin-boundaries'
import i18next from 'eslint-plugin-i18next'

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

							fix: (fixer) => {
								return fixer.replaceText(node.id, '$' + variableName)
							},
						})
					}
				}
			},
		}
	},
}

const paraglideMissingImport = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce paraglide messages import when using m.',
			category: 'Imports',
			recommended: true,
		},
		fixable: 'code',
		schema: [],
	},

	create(context) {
		let hasParaglideImport = false

		return {
			// Check if the import already exists
			ImportDeclaration(node) {
				if (
					node.source.value === '@/lib/paraglide/messages' &&
					node.specifiers.some(
						(spec) =>
							spec.type === 'ImportNamespaceSpecifier' &&
							spec.local.name === 'm',
					)
				) {
					hasParaglideImport = true
				}
			},

			// Check for m. usage
			MemberExpression(node) {
				if (
					node.object.type === 'Identifier' &&
					node.object.name === 'm' &&
					!hasParaglideImport
				) {
					context.report({
						node,
						message: 'Missing paraglide messages import',
						fix: (fixer) => {
							return fixer.insertTextBefore(
								context.getSourceCode().ast.body[0],
								"import * as m from '@/lib/paraglide/messages';\n",
							)
						},
					})
				}
			},
		}
	},
}

export default [
	{
		ignores: ['**/paraglide/**/*'],
	},
	...defaultConfig,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['src/email/**/*'], // Add this line to ignore the email folder
		...i18next.configs['flat/recommended'],
	},
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
					'paraglide-missing-import': paraglideMissingImport,
				},
			},
		},
		rules: {
			'custom/enforce-server-fn-prefix': 'error',
			'custom/paraglide-missing-import': 'error',
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
