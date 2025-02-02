import { execa } from 'execa'
import { feature } from '@/features/index.js'
import { waitForAutomatedAction } from '@/utils.js'

export const turso = feature('turso', {
	label: 'Turso Database',
	manualInstructions: [
		'1. Install Turso CLI: brew install tursodatabase/tap/turso',
		'2. Login: turso auth login',
		'3. Create database: turso db create [your-app-name]',
		'4. Get URL: turso db show [your-app-name] --url',
		'5. Create token: turso db tokens create [your-app-name]',
		'6. Set secrets in Fly.io and GitHub:',
		'   - TURSO_DATABASE_URL',
		'   - TURSO_AUTH_TOKEN',
	],
	onSelected: async (ctx) => {
		if (!ctx.cliStatus.turso?.isLoggedIn) {
			throw new Error('Turso CLI not available or not logged in')
		}

		return waitForAutomatedAction({
			waitingMessage: 'Creating Turso database',
			successMessage: 'Database created ✅',
			errorMessage: 'Failed to create database ❌',
			action: async () => {
				await execa('turso', ['db', 'create', ctx.projectName])
				const { stdout: dbUrl } = await execa('turso', [
					'db',
					'show',
					ctx.projectName,
					'--url',
				])

				if (!dbUrl) {
					throw new Error('Failed to get database URL')
				}

				const { stdout: authToken } = await execa('turso', [
					'db',
					'tokens',
					'create',
					ctx.projectName,
				])

				if (!authToken) {
					throw new Error('Failed to get auth token')
				}

				return {
					flySecrets: {
						TURSO_DATABASE_URL: dbUrl,
						TURSO_AUTH_TOKEN: authToken,
					},
					triggerSecrets: {
						TURSO_DATABASE_URL: dbUrl,
						TURSO_AUTH_TOKEN: authToken,
					},
				}
			},
		})
	},
})
