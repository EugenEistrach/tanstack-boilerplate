import { select } from '@clack/prompts'
import { execa } from 'execa'
import { feature } from '@/features/index.js'
import { ensureNotCanceled } from '@/utils.js'

export const githubRepo = feature('githubRepo', {
	label: 'GitHub Repository',
	manualInstructions: [
		'1. Install GitHub CLI: brew install gh',
		'2. Login: gh auth login',
		'3. Create repo: gh repo create [your-app-name] --private/--public --source=.',
	],
	onSelected: async (ctx) => {
		if (!ctx.cliStatus.gh?.isLoggedIn) {
			throw new Error('GitHub CLI not available or not logged in')
		}

		const visibility = (await ensureNotCanceled(
			select({
				message: 'Select visibility',
				options: [
					{ value: '--private', label: 'Private' },
					{ value: '--public', label: 'Public' },
				],
			}),
		)) as '--private' | '--public'

		await execa(
			'gh',
			['repo', 'create', '--push', '--source=.', visibility, ctx.projectName],
			{
				cwd: ctx.projectName,
				stdio: 'inherit',
			},
		)
	},
})
