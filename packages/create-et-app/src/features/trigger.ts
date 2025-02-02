import path from 'path'
import { confirm, log, note, text } from '@clack/prompts'
import { execa } from 'execa'
import fs from 'fs-extra'
import open from 'open'
import { feature } from '@/features/index.js'
import { ensureNotCanceled } from '@/utils.js'

export const trigger = feature('trigger', {
	label: 'Trigger.dev',
	onSelected: async (ctx) => {
		if (!ctx.cliStatus.trigger?.isLoggedIn) {
			throw new Error('Trigger.dev CLI not available or not logged in')
		}

		note(
			'We will open the Trigger.dev dashboard in your browser. Please create a new project and then come back to this terminal.',
			'Trigger.dev',
		)

		await open('https://cloud.trigger.dev/projects/new')

		const yes = await ensureNotCanceled(
			confirm({
				message: 'Have you created a new project?',
			}),
		)

		if (!yes) {
			throw new Error(
				'Trigger.dev project not created. Can not continue with trigger setup.',
			)
		}

		log.info(
			'Will initialize Trigger.dev next. Select the project you just created.',
		)

		await execa('pnpm', ['dlx', 'trigger.dev@latest', 'init'], {
			cwd: ctx.projectDir,
			stdio: 'inherit',
		})

		// extract project id from trigger.config.ts
		let triggerConfig = await fs.readFile(
			path.join(ctx.projectDir, 'trigger.config.ts'),
			'utf8',
		)

		const projectId = triggerConfig.match(/project:\s*['"](.*?)['"]/)?.[1]

		if (!projectId) {
			throw new Error(
				'Trigger.dev project id not found. Can not continue with trigger setup.',
			)
		}

		ctx.triggerProjectId = projectId

		let apiKey: string | undefined
		if (ctx.selectedFeatures.includes('fly')) {
			note(
				'To connect Trigger.dev to your Fly.io project, we need to add your projects PROD API key to your fly secrets. We will open the trigger dev dashboard in your browser. Please go to your projects API keys and copy the PROD key.',
			)

			await open('https://cloud.trigger.dev/')

			apiKey = ensureNotCanceled(
				await text({
					message: 'Enter the Trigger.dev PROD API key',
				}),
			)
		}

		let token: string | undefined
		if (ctx.selectedFeatures.includes('githubRepo')) {
			note(
				'To connect Trigger.dev to your GitHub repository action, we need to add the Trigger.dev access token to your GitHub secrets. We will open the trigger dev dashboard in your browser. Please create the token and then come back to this terminal.',
			)

			await open('https://cloud.trigger.dev/account/tokens')

			token = ensureNotCanceled(
				await text({
					message: 'Enter the Trigger.dev access token',
				}),
			)
		}

		return {
			flySecrets: apiKey
				? {
						TRIGGER_API_KEY: apiKey,
					}
				: undefined,
			githubSecrets: token
				? {
						TRIGGER_ACCESS_TOKEN: token,
					}
				: undefined,
		}
	},
})
