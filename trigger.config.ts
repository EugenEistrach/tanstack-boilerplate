import 'dotenv/config'

import { defineConfig } from '@trigger.dev/sdk/v3'

console.log('env', process.env)

export default defineConfig({
	project: 'proj_tlgfryfhwprwupwefzie',
	runtime: 'node',
	maxDuration: 300,
	retries: {
		enabledInDev: true,
		default: {
			maxAttempts: 3,
			minTimeoutInMs: 1000,
			maxTimeoutInMs: 10000,
			factor: 2,
			randomize: true,
		},
	},
	build: {
		external: ['libsql'],
	},
	dirs: ['src/tasks'],
})
