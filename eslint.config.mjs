import { default as defaultConfig } from '@epic-web/config/eslint'
import * as tanstackQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import gitignore from 'eslint-config-flat-gitignore'
import pluginBoundaries from 'eslint-plugin-boundaries'
import i18next from 'eslint-plugin-i18next'

import { enforceParaglideImportName } from './lint-rules/enforce-paraglide-import-name.mjs'
import { enforceServerFnPrefix } from './lint-rules/enforce-server-fn-prefix.mjs'
import { loggerErrorFormat } from './lint-rules/logger-error-format.mjs'
import { noRelativeImports } from './lint-rules/no-relative-imports.mjs'
import { paraglideMissingImport } from './lint-rules/paraglide-missing-import.mjs'

export default [
	{
		ignores: ['**/paraglide/**/*'],
	},
	...defaultConfig,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		ignores: ['src/email/**/*'],
		...i18next.configs['flat/recommended'],
		rules: {
			'i18next/no-literal-string': 'warn',
		},
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
					'logger-error-format': loggerErrorFormat,
					'enforce-paraglide-import-name': enforceParaglideImportName,
				},
			},
		},
		rules: {
			'custom/enforce-server-fn-prefix': 'error',
			'custom/paraglide-missing-import': 'error',
			'custom/logger-error-format': 'error',
			'custom/enforce-paraglide-import-name': 'error',
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			boundaries: pluginBoundaries,
		},
		settings: {
			'boundaries/include': ['src/**/*'],
			'boundaries/elements': [
				{
					mode: 'file',
					type: 'test-file',
					pattern: ['**/*.test.{js,jsx,ts,tsx}'],
				},
				{
					mode: 'full',
					type: 'core',
					pattern: [
						'src/entry.client.tsx',
						'src/entry.server.tsx',
						'src/router.tsx',
					],
				},
				{
					mode: 'full',
					type: 'shared',
					pattern: [
						'src/components/**/*',
						'src/data/**/*',
						'src/drizzle/**/*',
						'src/hooks/**/*',
						'src/lib/**/*',
						'src/styles/**/*',
						'src/features/_shared/**/*',
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
					pattern: ['src/*'],
				},
				{
					mode: 'full',
					type: 'trigger',
					pattern: ['src/trigger/**/*'],
				},
				{
					mode: 'full',
					type: 'tests',
					pattern: ['src/tests/**/*'],
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
							from: ['trigger'],
							allow: ['trigger'],
						},
						{
							from: ['core'],
							allow: ['*'],
						},
						{
							from: ['shared'],
							allow: ['shared', 'email'],
						},
						{
							from: ['feature'],
							allow: [
								'shared',
								['feature', { featureName: '${from.featureName}' }],
								'email',
							],
						},
						{
							from: ['routes', 'neverImport', 'trigger'],
							allow: ['shared', 'feature'],
						},
						{
							from: ['email'],
							allow: ['email', 'shared'],
						},
						{
							from: ['routes'],
							allow: [['routes', { fileName: '*.css' }]],
						},
						{
							from: ['tests'],
							allow: ['*'],
						},
						{
							from: ['test-file'],
							allow: ['*'],
						},
					],
				},
			],
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		settings: {
			'import/resolver': {
				typescript: {},
			},
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			'no-relative-imports': {
				rules: {
					'no-relative-imports': noRelativeImports,
				},
			},
		},
		rules: {
			'no-relative-imports/no-relative-imports': 'error',
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				project: true,
			},
		},
		rules: {
			'@typescript-eslint/await-thenable': 'error',
			'no-return-await': 'error',
		},
	},
]
