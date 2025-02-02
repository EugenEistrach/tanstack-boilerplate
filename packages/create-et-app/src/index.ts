import crypto from 'crypto'
import path from 'path'
import { multiselect, intro, text, log, confirm } from '@clack/prompts'
import { configure, envvars } from '@trigger.dev/sdk/v3'
import { type } from 'arktype'
import degit from 'degit'
import { execa } from 'execa'
import fs from 'fs-extra'

import {
	type CliDependencyName,
	verifyCliDependencies,
} from '@/check-cli-dependencies.js'
import { fly } from '@/features/fly.js'
import { githubRepo } from '@/features/github-repo.js'
import {
	type AvailableFeatures,
	type FeatureContext,
} from '@/features/index.js'
import { trigger } from '@/features/trigger.js'
import { ensureNotCanceled, validate, waitForAutomatedAction } from '@/utils.js'

const features = {
	trigger,
	fly,
	githubRepo,
}

async function cloneAndSetupLocalProject() {
	const projectName = await askProjectName()
	const appDisplayName = await askAppDisplayName()

	const projectDir = path.join(process.cwd(), projectName)

	await waitForAutomatedAction({
		waitingMessage: 'Cloning et-stack project...',
		successMessage: 'et-stack cloned successfully ✅',
		errorMessage: 'Failed to clone et-stack project ❌',
		action: async () => {
			const emitter = degit('EugenEistrach/tanstack-boilerplate', {
				cache: false,
				force: true,
				verbose: true,
			})
			await emitter.clone(projectName)
		},
	})

	await waitForAutomatedAction({
		waitingMessage: 'Updating project files...',
		successMessage: 'Project files updated successfully ✅',
		errorMessage: 'Failed to update project files ❌',
		action: async () => {
			// update package.json
			const packageJsonPath = path.join(projectDir, 'package.json')
			const pkg = await fs.readJson(packageJsonPath)
			pkg.name = projectName
			delete pkg.author
			delete pkg.license

			// Remove trigger-related scripts
			delete pkg.scripts['dev:trigger']
			delete pkg.scripts['deploy-trigger']

			// Remove trigger-related dependencies
			delete pkg.dependencies['@trigger.dev/sdk']
			delete pkg.devDependencies['@trigger.dev/build']
			await fs.writeJson(packageJsonPath, pkg, { spaces: 2 })

			// update env
			const envExamplePath = path.join(projectDir, '.env.example')
			const envPath = path.join(projectDir, '.env')
			if (!(await fs.pathExists(envExamplePath))) {
				throw new Error('.env.example not found')
			}
			let envContent = await fs.readFile(envExamplePath, 'utf8')
			envContent = envContent
				.replace(
					/^SESSION_SECRET=.*/m,
					`SESSION_SECRET=${crypto.randomBytes(33).toString('base64')}`,
				)
				.replace(
					/^APPLICATION_URL=.*/m,
					'APPLICATION_URL=http://localhost:3000',
				)
			await fs.writeFile(envPath, envContent)

			// update fly.toml
			const flyTomlPath = path.join(projectDir, 'fly.toml')
			if (await fs.pathExists(flyTomlPath)) {
				let flyToml = await fs.readFile(flyTomlPath, 'utf8')
				flyToml = flyToml.replace(
					/^app = ["'].*["']$/m,
					`app = "${projectName}"`,
				)
				await fs.writeFile(flyTomlPath, flyToml, 'utf8')
			}

			// remove trigger.config.ts
			const triggerConfigPath = path.join(projectDir, 'trigger.config.ts')
			if (await fs.pathExists(triggerConfigPath)) {
				await fs.remove(triggerConfigPath)
			}

			await fs.remove(path.join(projectDir, 'src/tasks'))

			// update locale files
			const messagesDir = path.join(projectDir, 'messages')
			const localeFiles = ['en.json', 'de.json']

			await fs.writeFile(
				path.join(projectDir, '.github/workflows/deploy.yml'),
				await fs.readFile(
					path.join(
						projectDir,
						'packages/create-et-app/src/2/templates/deploy.yml',
					),
					'utf8',
				),
			)

			for (const file of localeFiles) {
				const filePath = path.join(messagesDir, file)
				if (fs.existsSync(filePath)) {
					const content = await fs.readFile(filePath, 'utf8')
					const updatedContent = content.replace(/et-stack/g, appDisplayName)
					await fs.writeFile(filePath, updatedContent, 'utf8')
				}
			}
		},
	})

	await waitForAutomatedAction({
		waitingMessage: 'Installing dependencies',
		successMessage: 'Dependencies installed ✅',
		errorMessage: 'Failed to install dependencies ❌',
		action: async () => {
			await execa('pnpm', ['install'], {
				cwd: projectDir,
			})
		},
	})

	await waitForAutomatedAction({
		waitingMessage: 'Initializing git',
		successMessage: 'Git initialized ✅',
		errorMessage: 'Failed to initialize git ❌',
		action: async () => {
			await execa('git', ['init'], { cwd: projectDir })
			await execa('git', ['add', '.'], { cwd: projectDir })
			await execa('git', ['commit', '-m', 'Initial commit'], {
				cwd: projectDir,
			})
		},
	})

	return { projectName }
}

async function askWhichFeaturesToSetup() {
	const choices = ensureNotCanceled(
		await multiselect({
			message:
				'We will now help you set up production features. What would you like to set up?',
			options: [
				{
					value: 'githubRepo',
					label: 'GitHub Repository',
					hint: 'With gh action for automated deployments',
				},
				{ value: 'turso', label: 'Turso Database' },
				{ value: 'fly', label: 'Fly.io Deployment' },
				{ value: 'trigger', label: 'Trigger.dev Integration' },
				{ value: 'githubOauth', label: 'GitHub OAuth sso' },
			],
			initialValues: ['githubRepo', 'turso', 'fly', 'trigger', 'githubOauth'],
			required: false,
		}),
	)

	return choices as AvailableFeatures[]
}

async function askProjectName() {
	let projectName = process.argv[2]

	if (!projectName) {
		projectName = ensureNotCanceled(
			await text({
				message: 'What is your project name?',
				placeholder: 'my-app',
				validate: validate(type(/^[a-z0-9-]+$/)),
			}),
		)
	}

	return projectName
}

async function askAppDisplayName() {
	const result = ensureNotCanceled(
		await text({
			message: 'What is your application name? (This will be shown to users)',
			placeholder: 'My super cool App',
			validate: validate(type('string > 1')),
		}),
	)

	return result
}

async function executeFlyPostActions(ctx: FeatureContext) {
	if (!ctx.cliStatus.fly?.isLoggedIn) {
		throw new Error('Fly CLI not available or not logged in')
	}

	if (!ctx.completedFeatures.includes('fly')) {
		return
	}

	log.info('Running fly post actions...')

	await waitForAutomatedAction({
		waitingMessage: 'Adding Fly secrets',
		successMessage: 'Fly secrets added ✅',
		errorMessage: 'Failed to add Fly secrets ❌',
		action: async () => {
			await execa(
				'fly',
				[
					'secrets',
					'set',
					...Object.entries(ctx.flySecretsToSet).map(
						([name, value]) => `${name}=${value}`,
					),
					'--app',
					ctx.projectName,
				],
				{
					cwd: ctx.projectDir,
				},
			)
		},
	})

	const yes = ensureNotCanceled(
		await confirm({
			message: 'Should we run fly deploy?',
		}),
	)

	if (yes) {
		await execa('fly', ['deploy', '--app', ctx.projectName], {
			cwd: ctx.projectDir,
			stdio: 'inherit',
		})
	}
}

async function executeGitHubPostActions(ctx: FeatureContext) {
	if (!ctx.cliStatus.gh?.isLoggedIn) {
		throw new Error('GitHub CLI not available or not logged in')
	}

	if (!ctx.completedFeatures.includes('githubRepo')) {
		return
	}

	log.info('Running GitHub post actions...')

	await waitForAutomatedAction({
		waitingMessage: 'Adding GitHub action secrets',
		successMessage: 'GitHub action secrets added ✅',
		errorMessage: 'Failed to add GitHub action secrets ❌',
		action: async () => {
			for (const [name, value] of Object.entries(ctx.githubSecretsToSet)) {
				await execa('gh', ['secret', 'set', name, '--body', value], {
					cwd: ctx.projectDir,
				})
			}
		},
	})
}

async function executeTriggerPostActions(ctx: FeatureContext) {
	if (!ctx.completedFeatures.includes('trigger')) {
		return
	}

	const triggerApiKey =
		ctx.githubSecretsToSet.TRIGGER_ACCESS_TOKEN ||
		ctx.flySecretsToSet.TRIGGER_API_KEY

	if (!triggerApiKey) {
		log.warn(
			'It seems neither a Trigger access token nor a Trigger API key was provided during setup. We will not be able to update env vars.',
		)
		return
	}

	if (!ctx.triggerProjectId) {
		log.warn(
			'Trigger project id not found. Cannot continue with trigger post actions.',
		)
		return
	}

	log.info('Running Trigger post actions...')

	await waitForAutomatedAction({
		waitingMessage: 'Adding Trigger secrets',
		successMessage: 'Trigger secrets added ✅',
		errorMessage: 'Failed to add Trigger secrets ❌',
		action: async () => {
			configure({
				baseURL: 'https://cloud.trigger.dev',
				accessToken: triggerApiKey,
			})

			for (const [name, value] of Object.entries(ctx.triggerSecretsToSet)) {
				await envvars.create(ctx.triggerProjectId!, 'prod', {
					name,
					value,
				})
			}
		},
	})
}

async function applyTemplates(ctx: FeatureContext) {
	await waitForAutomatedAction({
		waitingMessage: 'Applying templates...',
		successMessage: 'Templates applied successfully ✅',
		errorMessage: 'Failed to apply templates ❌',
		action: async () => {
			if (
				ctx.completedFeatures.includes('fly') &&
				ctx.completedFeatures.includes('trigger')
			) {
				await fs.copy(
					path.join(
						process.cwd(),
						'packages/create-et-app/src/templates/.github/workflows/deploy-with-fly-and-trigger.yml',
					),
					path.join(ctx.projectDir, '.github/workflows/deploy.yml'),
				)
			} else if (ctx.completedFeatures.includes('fly')) {
				await fs.copy(
					path.join(
						process.cwd(),
						'packages/create-et-app/src/templates/.github/workflows/deploy-with-fly.yml',
					),
					path.join(ctx.projectDir, '.github/workflows/deploy.yml'),
				)
			} else if (ctx.completedFeatures.includes('trigger')) {
				await fs.copy(
					path.join(
						process.cwd(),
						'packages/create-et-app/src/templates/.github/workflows/deploy-with-trigger.yml',
					),
					path.join(ctx.projectDir, '.github/workflows/deploy.yml'),
				)
			}
		},
	})
}

async function cleanUp() {
	await waitForAutomatedAction({
		waitingMessage: 'Cleaning up...',
		successMessage: 'Cleanup complete ✅',
		errorMessage: 'Failed to cleanup ❌',
		action: async () => {
			await fs.remove(path.join(process.cwd(), 'packages'))
			await fs.remove(path.join(process.cwd(), 'pnpm-workspace.yaml'))
		},
	})
}

async function main() {
	intro('Welcome to create-et-app!')

	const { projectName } = await cloneAndSetupLocalProject()
	const selectedFeatures = await askWhichFeaturesToSetup()

	const requiredClis: CliDependencyName[] = []
	if (selectedFeatures.includes('fly')) requiredClis.push('fly')
	if (selectedFeatures.includes('turso')) requiredClis.push('turso')
	if (
		selectedFeatures.includes('githubRepo') ||
		selectedFeatures.includes('githubOauth')
	)
		requiredClis.push('gh')
	if (selectedFeatures.includes('trigger')) requiredClis.push('trigger')

	const cliStatus = await verifyCliDependencies(requiredClis)

	const context: FeatureContext = {
		projectName,
		projectDir: path.join(process.cwd(), projectName),
		completedFeatures: [],
		flySecretsToSet: {},
		triggerSecretsToSet: {},
		githubSecretsToSet: {},
		selectedFeatures,
		cliStatus,
	}

	for (const feature of Object.values(features)) {
		if (selectedFeatures.includes(feature.code)) {
			try {
				log.info(`Setting up ${feature.label}...`)
				const result = await feature.onSelected(context)
				context.completedFeatures.push(feature.code)

				if (result) {
					context.flySecretsToSet = {
						...context.flySecretsToSet,
						...result.flySecrets,
					}

					context.triggerSecretsToSet = {
						...context.triggerSecretsToSet,
						...result.triggerSecrets,
					}

					context.githubSecretsToSet = {
						...context.githubSecretsToSet,
						...result.githubSecrets,
					}
				}
			} catch (error) {
				if (error instanceof Error) {
					log.error(`Failed to setup ${feature.label}: ${error.message}`)
				} else {
					log.error(`Failed to setup ${feature.label}`)
				}
				if (feature.onSkipped) {
					await feature.onSkipped(context)
				}
			}
		} else {
			if (feature.onSkipped) {
				log.info(`Skipping ${feature.label}...`)
				await feature.onSkipped(context)
			}
		}
	}

	await executeFlyPostActions(context)
	await executeGitHubPostActions(context)
	await executeTriggerPostActions(context)

	await applyTemplates(context)

	await cleanUp()
}

process.on('uncaughtException', async (error) => {
	console.error('Unexpected error:', error)
	process.exit(1)
})

process.on('unhandledRejection', async (error) => {
	console.error('Unhandled rejection:', error)
	process.exit(1)
})

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})
