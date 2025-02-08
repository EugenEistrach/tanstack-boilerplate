import 'dotenv/config'

import { defineConfig, devices } from '@playwright/test'
import { env } from '@/lib/server/env.server'

// Default ports
const port = process.env['PORT'] ?? '3000'
const storybookPort = process.env['STORYBOOK_PORT'] ?? '6006'

// For E2E tests, fall back to a local database path if TEST_DB_PATH isn't set
if (!process.env['TEST_DB_PATH']) {
	process.env['TEST_DB_PATH'] = env.LOCAL_DATABASE_PATH
}

if (!process.env['TEST_DB_PATH']) {
	throw new Error('TEST_DB_PATH is required.')
}

// Determine which server to start based on the test project
const isStorybookTest = process.env['TEST_PROJECT'] === 'storybook'

export default defineConfig({
	// Centralize all test outputs and screenshots in one folder
	outputDir: './test-results',
	timeout: 30 * 1000, // Increased timeout for Storybook
	expect: {
		timeout: 10 * 1000,
	},
	fullyParallel: true,
	forbidOnly: !!env.CI,
	retries: env.CI ? 2 : 0,
	workers: env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
		timezoneId: 'Europe/Berlin',
		locale: 'en-US',
		colorScheme: 'dark',
	},

	projects: [
		// ----- E2E Project -----
		{
			name: 'e2e',
			testDir: './src/tests/e2e',
			// Use a negative lookahead to avoid matching Storybook test files (.stories.spec.ts)
			testMatch: /^(?!.*\.stories\.spec\.ts$).*\.spec\.ts$/,
			use: {
				...devices['Desktop Chrome'],
				baseURL: `http://localhost:${port}/`,
			},
		},
		// ----- Storybook Project -----
		{
			name: 'storybook',
			testDir: './src/tests/storybook',
			testMatch: '**/stories.spec.ts',
			use: {
				...devices['Desktop Chrome'],
				baseURL: `http://localhost:${storybookPort}`,
			},
		},
	],

	// Configure the appropriate web server based on the test project
	webServer: isStorybookTest
		? {
				command: env.CI
					? `pnpm dlx http-server storybook-static -p ${storybookPort}`
					: 'pnpm storybook',
				url: `http://localhost:${storybookPort}`,
				reuseExistingServer: true,
				timeout: 120000,
			}
		: {
				command: env.CI ? 'npm run start:mocks' : 'npm run dev',
				url: `http://localhost:${port}`,
				reuseExistingServer: true,
				env: {
					PORT: port,
					NODE_ENV: 'test',
					TEST_DB_PATH: process.env['TEST_DB_PATH'] as string,
				},
			},
})
