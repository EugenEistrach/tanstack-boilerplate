import path from 'path'
import { confirm, log, note, password } from '@clack/prompts'
import { execa } from 'execa'
import open from 'open'
import { Project, SyntaxKind } from 'ts-morph'
import { feature } from '@/features/index.js'
import { ensureNotCanceled } from '@/utils.js'

export const trigger = feature('trigger', {
	label: 'Trigger.dev',
	manualInstructions: [
		'1. Create account at https://cloud.trigger.dev',
		'2. Create new project in dashboard',
		'3. Run: pnpm dlx trigger.dev@latest init',
		'4. Get API key from Project Settings > API Keys',
		'5. Set secrets:',
		'   - TRIGGER_API_KEY in Fly.io',
		'   - TRIGGER_ACCESS_TOKEN in GitHub (if using Actions)',
	],
	onSelected: async (ctx) => {
		if (!ctx.cliStatus.trigger?.isLoggedIn) {
			throw new Error('Trigger.dev CLI not available or not logged in')
		}

		note(
			'Create a new project in Trigger.dev dashboard.\nWe will open it in your browser.',
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

		log.warn(
			'Make sure to keep the default trigger folder name. Otherwise you will need to do manual changes to fix CI linting',
		)

		await execa('pnpm', ['dlx', 'trigger.dev@latest', 'init'], {
			cwd: ctx.projectDir,
			stdio: 'inherit',
		})

		const configPath = path.join(ctx.projectDir, 'trigger.config.ts')
		const { projectId } = await addOnSuccessToTriggerConfig(configPath)
		ctx.triggerProjectId = projectId

		let apiKey: string | undefined
		if (ctx.selectedFeatures.includes('fly')) {
			note(
				'To connect with Fly.io, we need your Trigger.dev PROD API key.\n' +
					'Find it in Project Settings > API Keys.',
			)

			await open('https://cloud.trigger.dev/')

			apiKey = ensureNotCanceled(
				await password({
					message: 'Enter the Trigger.dev PROD API key',
				}),
			)
		}

		let token: string | undefined
		if (ctx.selectedFeatures.includes('githubRepo')) {
			note(
				'To enable GitHub Actions integration, we need a Trigger.dev access token.\n' +
					'Create one in Account Settings > Access Tokens.',
			)

			await open('https://cloud.trigger.dev/account/tokens')

			token = ensureNotCanceled(
				await password({
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

const onSuccessCallback = `async () => {
  if (!process.env.APPLICATION_URL) {
    logger.error('APPLICATION_URL not set. Cannot sync application database')
    return
  }

  if (!process.env.API_KEY) {
    logger.error('API_KEY not set. Cannot sync application database')
    return
  }

  const response = await fetch(\`\${process.env.APPLICATION_URL}/api/sync-db\`, {
    method: 'POST',
    headers: {
      Authorization: process.env.API_KEY,
    },
  })

  if (!response.ok) {
    logger.error('Failed to sync application database', { response })
    return
  }

  logger.info('Remote application database synced')
}`

async function addOnSuccessToTriggerConfig(configPath: string) {
	const project = new Project()
	const sourceFile = project.addSourceFileAtPath(configPath)

	// Find the defineConfig call
	const defineConfigCall = sourceFile.getFirstDescendantByKind(
		SyntaxKind.CallExpression,
	)
	if (
		!defineConfigCall ||
		defineConfigCall.getExpression().getText() !== 'defineConfig'
	) {
		throw new Error('Could not find defineConfig call in trigger.config.ts')
	}

	// Get the config object
	const configObject = defineConfigCall.getArguments()[0]
	if (
		!configObject ||
		!configObject.isKind(SyntaxKind.ObjectLiteralExpression)
	) {
		throw new Error('Could not find config object in defineConfig call')
	}

	// Get project ID before modifying the file
	const projectProp = configObject.getProperty('project')
	const projectId = projectProp
		?.getFirstDescendantByKind(SyntaxKind.StringLiteral)
		?.getLiteralValue()

	if (!projectId) {
		throw new Error('Could not find project ID in trigger.config.ts')
	}

	// Add onSuccess property
	configObject.addPropertyAssignment({
		name: 'onSuccess',
		initializer: onSuccessCallback,
	})

	// Save the changes
	await sourceFile.save()

	return { projectId }
}
