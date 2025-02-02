import { log, password } from '@clack/prompts'

import open from 'open'
import { feature } from '@/features/index.js'
import { ensureNotCanceled } from '@/utils.js'

export const githubOauth = feature('githubOauth', {
	label: 'GitHub OAuth',
	manualInstructions: [
		'1. Go to GitHub OAuth apps page: https://github.com/settings/applications/new',
		'2. Create new OAuth app with Homepage URL: https://[your-app].fly.dev',
		'3. Set callback URL to: https://[your-app].fly.dev/api/auth/callback/github',
		'4. Copy Client ID and Client Secret',
		'5. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Fly.io secrets',
	],
	onSelected: async (ctx) => {
		if (!ctx.cliStatus.gh?.isLoggedIn) {
			throw new Error('GitHub CLI not available or not logged in')
		}

		if (!ctx.selectedFeatures.includes('fly')) {
			log.warning(
				'Fly is not selected. GitHub OAuth will not be setup. Do manually if needed.',
			)
			return
		}

		log.info('Setting up GitHub OAuth...')
		log.info(
			'We will open GitHub OAuth apps page. Create a new OAuth app with these settings:',
		)

		log.info(`  - Homepage URL: https://${ctx.projectName}.fly.dev`)
		log.info(
			`  - Authorization callback URL: https://${ctx.projectName}.fly.dev/api/auth/callback/github`,
		)

		await open('https://github.com/settings/applications/new')

		const clientId = ensureNotCanceled(
			await password({
				message: 'Enter the GitHub OAuth Client ID',
			}),
		)

		const clientSecret = ensureNotCanceled(
			await password({
				message: 'Enter the GitHub OAuth Client Secret',
			}),
		)

		return {
			flySecrets: {
				GITHUB_CLIENT_ID: clientId,
				GITHUB_CLIENT_SECRET: clientSecret,
			},
		}
	},
})
