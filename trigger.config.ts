import 'dotenv/config'

import { defineConfig, logger } from '@trigger.dev/sdk/v3'
import { env } from '@/lib/server/env.server'

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
	onSuccess: async () => {
		const applicationUrl = env.APPLICATION_URL

		if (!env.API_KEY) {
			logger.error('API_KEY not set. Cannot sync application database')
			return
		}

		const response = await fetch(`${applicationUrl}/api/sync-db`, {
			method: 'POST',
			headers: {
				Authorization: env.API_KEY,
			},
		})

		if (!response.ok) {
			logger.error('Failed to sync application database', { response })
			return
		}

		logger.info('Remote application database synced')
	},
})
