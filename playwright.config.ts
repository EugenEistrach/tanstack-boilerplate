import 'dotenv/config'

import { defineConfig, devices } from '@playwright/test'
import { env } from '@/lib/server/env.server'

const port = process.env['PORT'] ?? '3000'
export default defineConfig({
	testDir: './src/tests/e2e',
	timeout: 15 * 1000,
	expect: {
		timeout: 5 * 1000,
	},
	fullyParallel: true,
	forbidOnly: !!env.CI,
	retries: env.CI ? 2 : 0,
	workers: env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: `http://localhost:${port}/`,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
		timezoneId: 'Europe/Berlin',
		locale: 'en-US',
		colorScheme: 'dark',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: {
		command: env.CI ? 'npm run start:mocks' : 'npm run dev',
		port: Number(port),
		reuseExistingServer: true,
		stdout: 'pipe',
		stderr: 'pipe',
		env: {
			PORT: port,
			NODE_ENV: 'test',
		},
	},
})
