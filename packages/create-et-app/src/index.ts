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
import { githubOauth } from '@/features/github-oauth.js'
import { githubRepo } from '@/features/github-repo.js'
import {
	type AvailableFeatures,
	type FeatureContext,
} from '@/features/index.js'
import { trigger } from '@/features/trigger.js'
import { turso } from '@/features/turso.js'
import { ensureNotCanceled, validate, waitForAutomatedAction } from '@/utils.js'

const repo = 'EugenEistrach/et-stack'
const cliPath = 'packages/create-et-app/src'

const features = {
	githubRepo,
	turso,
	fly,
	trigger,
	githubOauth,
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
			const emitter = degit(repo, {
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

			await fs.remove(path.join(projectDir, 'src/trigger'))
			await fs.remove(path.join(projectDir, 'pnpm-workspace.yaml'))

			// update locale files
			const messagesDir = path.join(projectDir, 'messages')
			const localeFiles = ['en.json', 'de.json']

			await fs.remove(path.join(projectDir, '.github/workflows/deploy.yml'))

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
			await fs.appendFile(
				path.join(projectDir, '.gitignore'),
				'\npackages/create-et-app',
			)

			await execa('git', ['init'], { cwd: projectDir })
			await execa('git', ['add', '.'], { cwd: projectDir })
			await execa('git', ['commit', '-m', 'Initial commit'], {
				cwd: projectDir,
			})
		},
	})

	return { projectName, appDisplayName }
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
				},
				{ value: 'turso', label: 'Turso Database' },
				{ value: 'fly', label: 'Fly.io Deployment' },
				{ value: 'trigger', label: 'Trigger.dev Integration' },
				{
					value: 'githubOauth',
					label: 'GitHub OAuth sso',
					hint: 'Only applies if Fly.io was selected',
				},
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
						ctx.projectDir,
						`${cliPath}/templates/.github/workflows/deploy-with-fly-and-trigger.yml`,
					),
					path.join(ctx.projectDir, '.github/workflows/deploy.yml'),
				)
			} else if (ctx.completedFeatures.includes('fly')) {
				await fs.copy(
					path.join(
						ctx.projectDir,
						`${cliPath}/templates/.github/workflows/deploy-with-fly.yml`,
					),
					path.join(ctx.projectDir, '.github/workflows/deploy.yml'),
				)
			} else if (ctx.completedFeatures.includes('trigger')) {
				await fs.copy(
					path.join(
						ctx.projectDir,
						`${cliPath}/templates/.github/workflows/deploy-with-trigger.yml`,
					),
					path.join(ctx.projectDir, '.github/workflows/deploy.yml'),
				)
			}
		},
	})
}

async function generateProductionChecklist(ctx: FeatureContext) {
	const pendingFeatures = ctx.selectedFeatures.filter(
		(f) => !ctx.completedFeatures.includes(f),
	)

	// Add environment variables section
	const allSecrets = {
		'Fly.io Secrets': ctx.flySecretsToSet,
		'Trigger.dev Secrets': ctx.triggerSecretsToSet,
		'GitHub Secrets': ctx.githubSecretsToSet,
	}

	// Check if there are any missing secrets (secrets that need to be set)
	const hasMissingSecrets = Object.values(allSecrets).some((secrets) =>
		Object.values(secrets).some((value) => !value),
	)

	if (pendingFeatures.length === 0 && !hasMissingSecrets) {
		return false
	}

	let markdown = '# Production Setup Checklist\n\n'
	markdown +=
		'This file contains manual steps that need to be completed for production setup.\n\n'

	// Add pending features manual instructions
	if (pendingFeatures.length > 0) {
		markdown += '## Pending Features Setup\n\n'
		for (const featureCode of pendingFeatures) {
			const feature = features[featureCode]
			if (feature.manualInstructions) {
				markdown += `### ${feature.label}\n\n`
				feature.manualInstructions
					.filter(
						(instruction) =>
							!instruction.includes('Set') || !instruction.includes('secret'),
					)
					.forEach((instruction) => {
						markdown += `- [ ] ${instruction}\n`
					})
				markdown += '\n'
			}
		}
	}

	// Add missing secrets section
	if (hasMissingSecrets) {
		markdown += '## Required Secrets\n\n'
		markdown += 'The following secrets need to be set:\n\n'

		for (const [platform, secrets] of Object.entries(allSecrets)) {
			const missingSecrets = Object.entries(secrets).filter(
				([_, value]) => !value,
			)
			if (missingSecrets.length > 0) {
				markdown += `### ${platform}\n\n`
				for (const [key] of missingSecrets) {
					markdown += `- [ ] \`${key}\`\n`
				}
				markdown += '\n'
			}
		}
	}

	await fs.writeFile(
		path.join(ctx.projectDir, 'PRODUCTION-CHECKLIST.md'),
		markdown,
	)

	log.info('Created PRODUCTION-CHECKLIST.md with pending setup instructions')
	return true
}

async function generateReadme(ctx: FeatureContext, appDisplayName: string) {
	let markdown = `# ${appDisplayName}\n\n`

	// Quick start section
	markdown += '## Quick Start\n\n'
	markdown += '```bash\n'
	markdown += '# Install dependencies\n'
	markdown += 'pnpm install\n\n'
	markdown += '# Start development server\n'
	markdown += 'pnpm dev\n'
	markdown += '```\n\n'

	// Key Commands section
	markdown += '## Key Commands\n\n'
	markdown += '```bash\n'
	markdown += '# Development\n'
	markdown += 'pnpm dev           # Start development server\n'
	markdown += 'pnpm build         # Build for production\n'
	markdown += 'pnpm start         # Start production server\n\n'

	markdown += '# Database\n'
	markdown += 'pnpm db:migrate    # Run database migrations\n'
	markdown += 'pnpm db:studio     # Open database UI\n'
	markdown += 'pnpm db:reset      # Reset database (clear + migrate + seed)\n\n'

	if (ctx.selectedFeatures.includes('trigger')) {
		markdown += '# Background Jobs\n'
		markdown +=
			'pnpm dlx trigger.dev@latest dev   # Start Trigger.dev development server\n\n'
	}

	markdown += '# Testing\n'
	markdown += 'pnpm test          # Run tests\n'
	markdown += 'pnpm typecheck     # Run typecheck\n'
	markdown += 'pnpm lint          # Run lint\n'
	markdown += 'pnpm verify        # Run all checks (lint, typecheck, test)\n'
	markdown += '```\n\n'

	// Add reference to production checklist if it exists
	const hasChecklist = await fs.pathExists(
		path.join(ctx.projectDir, 'PRODUCTION-CHECKLIST.md'),
	)
	if (hasChecklist) {
		markdown += '\n## Production Setup\n\n'
		markdown +=
			'See [`PRODUCTION-CHECKLIST.md`](./PRODUCTION-CHECKLIST.md) for production deployment steps.\n'
	}

	await fs.writeFile(path.join(ctx.projectDir, 'readme.md'), markdown)
}

async function cleanUp() {
	await waitForAutomatedAction({
		waitingMessage: 'Cleaning up...',
		successMessage: 'Cleanup complete ✅',
		errorMessage: 'Failed to cleanup ❌',
		action: async () => {
			await fs.remove(path.join(process.cwd(), 'packages'))
		},
	})
}

async function main() {
	intro('Welcome to create-et-app!')

	const { projectName, appDisplayName } = await cloneAndSetupLocalProject()
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
	const checklistGenerated = await generateProductionChecklist(context)
	await generateReadme(context, appDisplayName)
	await cleanUp()

	await waitForAutomatedAction({
		waitingMessage: 'Squashing changes into initial commit',
		successMessage: 'Changes squashed into initial commit ✅',
		errorMessage: 'Failed to squash changes ❌',
		action: async () => {
			await execa('git', ['add', '.'], { cwd: context.projectDir })
			await execa('git', ['commit', '--amend', '--no-edit'], {
				cwd: context.projectDir,
			})
		},
	})

	if (context.selectedFeatures.includes('githubRepo')) {
		const yes = ensureNotCanceled(
			await confirm({
				message:
					'Should we push to GitHub? This should also trigger deploy action.',
			}),
		)
		if (yes) {
			await waitForAutomatedAction({
				waitingMessage: 'Pushing to GitHub',
				successMessage: 'Pushed to GitHub ✅',
				errorMessage: 'Failed to push to GitHub ❌',
				action: async () => {
					await execa('git', ['push', '--force'], {
						cwd: context.projectDir,
					})
				},
			})
		}
	}

	log.info('\n🎉 Setup complete! Your project is ready.\n')

	const links: string[] = []

	if (context.completedFeatures.includes('githubRepo')) {
		const { stdout } = await execa('git', ['remote', 'get-url', 'origin'], {
			cwd: context.projectDir,
		})
		links.push(`GitHub Repository: ${stdout.trim()}`)
	}

	if (context.completedFeatures.includes('fly')) {
		const flyUrl = `https://${context.projectName}.fly.dev`
		links.push(`Production URL: ${flyUrl}`)
	}

	if (links.length > 0) {
		log.info('\nQuick Links:')
		links.forEach((link) => log.info(`  ${link}`))
	}

	if (checklistGenerated) {
		log.info(
			'Please review the PRODUCTION-CHECKLIST.md file for pending setup instructions.',
		)
	}

	log.info('\nNext steps:')
	log.info(`  1. cd ${context.projectName}`)
	log.info('  2. pnpm dev    # Start development server')
	log.info('  3. Open http://localhost:3000 in your browser\n')
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
