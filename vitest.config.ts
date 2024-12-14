import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['./src/**/*.test.{ts,tsx}'],
		setupFiles: ['./src/tests/setup/setup-test-env.ts'],
		globalSetup: ['./src/tests/setup/global-setup.ts'],
		restoreMocks: true,
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			all: true,
			enabled: true,
			exclude: [
				'node_modules/',
				'src/tests/',
				'src/*.{ts,tsx}',
				'src/components/',
				'src/email/',
				'src/routes',
				'src/tasks',
				'**/*.test.ts',
				'**/*.spec.ts',
				'**/templates/**',
				// We test ui via e2e playwright tests
				// TODO: maybe also add storybook
				'**/ui/**',

				'**/*.api.ts',
			],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
})
