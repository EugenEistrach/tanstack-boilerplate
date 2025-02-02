import crypto from 'crypto'
import { text } from '@clack/prompts'
import { type } from 'arktype'
import { execa } from 'execa'
import { feature } from '@/features/index.js'
import { ensureNotCanceled, validate } from '@/utils.js'

export const fly = feature('fly', {
	label: 'Fly.io',
	manualInstructions: [
		'1. Install Fly CLI: brew install flyctl',
		'2. Login to Fly: fly auth login',
		'3. Create new app: fly apps create [your-app-name]',
		'4. Create deploy token: fly tokens create deploy',
		'5. Set required secrets in GitHub repo:',
		'   - FLY_API_TOKEN',
		'   - SESSION_SECRET (32+ char random string)',
		'   - API_KEY (32+ char random string)',
		'   - APPLICATION_URL (https://[your-app].fly.dev)',
		'   - ADMIN_USER_EMAILS (comma-separated list)',
	],
	onSelected: async (ctx) => {
		if (!ctx.cliStatus.gh?.isLoggedIn) {
			throw new Error('GitHub CLI not available or not logged in')
		}

		const sessionSecret = crypto.randomBytes(32).toString('hex')
		const applicationUrl = `https://${ctx.projectName}.fly.dev`
		const apiKey = crypto.randomBytes(32).toString('hex')
		const adminEmails = await askForAdminEmails()

		await execa('fly', ['apps', 'create', ctx.projectName], {
			cwd: ctx.projectDir,
			stdio: 'inherit',
		})

		const { stdout: flyDeployToken } = await execa(
			'fly',
			['tokens', 'create', 'deploy'],
			{
				cwd: ctx.projectDir,
			},
		)

		return {
			flySecrets: {
				ADMIN_USER_EMAILS: adminEmails,
				SESSION_SECRET: sessionSecret,
				APPLICATION_URL: applicationUrl,
				API_KEY: apiKey,
			},
			triggerSecrets: {
				API_KEY: apiKey,
				APPLICATION_URL: applicationUrl,
			},
			githubSecrets: {
				FLY_API_TOKEN: flyDeployToken,
			},
		}
	},
})

async function askForAdminEmails() {
	return ensureNotCanceled(
		await text({
			message:
				'To set up admin users for production, enter their emails, separated by commas (leave blank for no admins):',
			placeholder: 'admin@example.com, admin2@example.com',
			validate: validate(
				type('string | undefined').pipe((val) => {
					if (!val) return [] // Empty string is valid
					return val.split(',').map((s) => s.trim())
				}, type('string.email[]')),
			),
		}),
	)
}
