import { execSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import {
	intro,
	outro,
	text,
	spinner,
	note,
	multiselect,
	isCancel,
} from '@clack/prompts'
import { type, type Type } from 'arktype'
import color from 'picocolors'

interface OAuthConfig {
	github?: {
		clientId: string
		clientSecret: string
	}
	discord?: {
		clientId: string
		clientSecret: string
	}
}

function validate(schema: Type) {
	return (value: unknown) => {
		const result = schema(value)
		if (result instanceof type.errors) {
			return result.summary
		}
		return undefined
	}
}

function handleCancel<T>(response: T | symbol): asserts response is T {
	if (isCancel(response)) {
		process.exit(1)
	}
}

async function openBrowser(url: string) {
	const platform = process.platform
	const cmd =
		platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open'
	execSync(`${cmd} ${url}`)
}

async function setupGitHubOAuth(appName: string, applicationUrl: string) {
	const s = spinner()
	s.start('Setting up GitHub OAuth')

	note(
		'I will now open GitHub to create a new OAuth application.\n' +
			'Please follow these steps:\n' +
			'1. Click "New OAuth Application"\n' +
			'2. Use these settings:\n' +
			`   Application name: ${appName}\n` +
			`   Homepage URL: ${applicationUrl}\n` +
			`   Authorization callback URL: ${applicationUrl}/auth/github/callback\n` +
			'3. Copy the Client ID and Client Secret',
	)

	await openBrowser('https://github.com/settings/developers')

	const clientId = await text({
		message: 'Enter your GitHub Client ID',
		validate: validate(type('string >= 1')),
	})

	handleCancel(clientId)

	const clientSecret = await text({
		message: 'Enter your GitHub Client Secret',
		validate: validate(type('string >= 1')),
	})

	handleCancel(clientSecret)

	s.stop('GitHub OAuth configured')
	return { clientId, clientSecret }
}

async function setupDiscordOAuth(
	appName: string,
	applicationUrl: string,
): Promise<{ clientId: string; clientSecret: string }> {
	const s = spinner()
	s.start('Setting up Discord OAuth')

	note(
		'I will now open Discord Developer Portal to create a new application.\n' +
			'Please follow these steps:\n' +
			'1. Click "New Application"\n' +
			`2. Name it "${appName}"\n` +
			'3. Go to "OAuth2" settings\n' +
			'4. Add this redirect URL:\n' +
			`   ${applicationUrl}/auth/discord/callback\n` +
			'5. Copy the Client ID and Client Secret',
	)

	await openBrowser('https://discord.com/developers/applications')

	const clientId = await text({
		message: 'Enter your Discord Client ID',
		validate: validate(type('string >= 1')),
	})

	handleCancel(clientId)

	const clientSecret = await text({
		message: 'Enter your Discord Client Secret',
		validate: validate(type('string >= 1')),
	})

	handleCancel(clientSecret)

	s.stop('Discord OAuth configured')
	return { clientId, clientSecret }
}

async function setup(): Promise<void> {
	try {
		intro(color.blue('TanStack Boilerplate Setup'))

		const defaultAppName = path.basename(process.cwd())
		const s = spinner()

		// Basic setup questions
		const appName = await text({
			message: 'What is your app name?',
			defaultValue: defaultAppName,
			placeholder: 'my-awesome-app',
			validate: validate(type(/^[a-z0-9-]+$/)),
		})

		handleCancel(appName)

		const adminEmailText = await text({
			message: 'Enter admin email addresses (comma-separated)',
			defaultValue: 'admin@example.com',
			validate: validate(
				type('string >= 1').pipe(
					(val) => (val || '').split(',').map((s) => s.trim()),
					type('string.email[]'),
				),
			),
		})

		handleCancel(adminEmailText)

		const adminEmails = adminEmailText.split(',').map((e) => e.trim())

		const applicationUrl = await text({
			message: 'Enter your application URL',
			defaultValue: 'http://localhost:3000',
			validate: validate(type('string.url')),
		})

		handleCancel(applicationUrl)

		// OAuth provider selection
		const oauthProviders = await multiselect({
			message: 'Select OAuth providers to configure (at least one required)',
			options: [
				{ value: 'github' as const, label: 'GitHub' },
				{ value: 'discord' as const, label: 'Discord' },
			],
			required: true,
		})

		handleCancel(oauthProviders)

		const config = {
			appName,
			adminEmails,
			applicationUrl,
			oauthProviders,
		}

		// Update package.json
		s.start('Updating package.json')
		const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'))
		packageJson.name = config.appName
		packageJson.version = '0.1.0'
		await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2))
		s.stop('Updated package.json')

		// Update fly.toml if it exists
		try {
			s.start('Updating fly.toml')
			const flyConfig = await fs.readFile('fly.toml', 'utf8')
			const updatedFlyConfig = flyConfig.replace(
				/app = ".*"/g,
				`app = "${config.appName}"`,
			)
			await fs.writeFile('fly.toml', updatedFlyConfig)
			s.stop('Updated fly.toml')
		} catch {
			s.stop('No fly.toml found, skipping')
		}

		// Initialize git repository
		s.start('Initializing git repository')
		execSync('git init')
		execSync(
			'git remote add boilerplate https://github.com/EugenEistrach/tanstack-boilerplate.git',
		)
		execSync('git add .')
		execSync('git commit -m "Initial commit from boilerplate"')

		note(
			'I will now open GitHub to create a new repository.\n' +
				'Please follow these steps:\n' +
				'1. Click "New repository"\n' +
				`2. Name it "${config.appName}"\n` +
				'3. DO NOT initialize with README, license, or gitignore\n' +
				'4. Click "Create repository"\n' +
				'5. Copy the repository URL',
		)

		await openBrowser('https://github.com/new')

		const repoUrl = (await text({
			message: 'Enter your GitHub repository URL',
			validate: validate(
				type('string.url').pipe(type(/^https:\/\/github\.com\/.*/)),
			),
		})) as string

		handleCancel(repoUrl)

		execSync('git remote remove origin || true') // Remove origin if it exists
		execSync(`git remote add origin ${repoUrl}`)
		execSync('git push -u origin main')
		s.stop('Git repository initialized and pushed to GitHub')

		// Set up OAuth providers
		const oauthConfig: OAuthConfig = {}

		if (oauthProviders.includes('github')) {
			const github = await setupGitHubOAuth(
				config.appName,
				config.applicationUrl,
			)
			oauthConfig.github = github
		}

		if (oauthProviders.includes('discord')) {
			const discord = await setupDiscordOAuth(
				config.appName,
				config.applicationUrl,
			)
			oauthConfig.discord = discord
		}

		// Set up environment variables
		s.start('Setting up environment variables')
		await fs.copyFile('.env.example', '.env')
		const envContent = await fs.readFile('.env', 'utf8')
		let updatedEnvContent = envContent
			.replace(
				/^SESSION_SECRET=.*/m,
				`SESSION_SECRET=${crypto.randomBytes(33).toString('base64')}`,
			)
			.replace(/^APP_NAME=.*/m, `APP_NAME=${config.appName}`)
			.replace(
				/^APPLICATION_URL=.*/m,
				`APPLICATION_URL=${config.applicationUrl}`,
			)
			.replace(
				/^ADMIN_USER_EMAILS=.*/m,
				`ADMIN_USER_EMAILS=${config.adminEmails}`,
			)

		// Add OAuth credentials
		if (oauthConfig.github) {
			updatedEnvContent = updatedEnvContent
				.replace(
					/^GITHUB_CLIENT_ID=.*/m,
					`GITHUB_CLIENT_ID=${oauthConfig.github.clientId}`,
				)
				.replace(
					/^GITHUB_CLIENT_SECRET=.*/m,
					`GITHUB_CLIENT_SECRET=${oauthConfig.github.clientSecret}`,
				)
		}

		if (oauthConfig.discord) {
			updatedEnvContent = updatedEnvContent
				.replace(
					/^DISCORD_CLIENT_ID=.*/m,
					`DISCORD_CLIENT_ID=${oauthConfig.discord.clientId}`,
				)
				.replace(
					/^DISCORD_CLIENT_SECRET=.*/m,
					`DISCORD_CLIENT_SECRET=${oauthConfig.discord.clientSecret}`,
				)
		}

		await fs.writeFile('.env', updatedEnvContent)
		s.stop('Environment variables configured')

		// Install dependencies
		s.start('Installing dependencies')
		execSync('pnpm install', { stdio: 'inherit' })
		s.stop('Dependencies installed')

		// Initialize the database
		s.start('Initializing database')
		execSync('pnpm run db:reset', { stdio: 'inherit' })
		s.stop('Database initialized')

		note(
			'Optional environment variables you might want to set up:\n' +
				'- RESEND_API_KEY: Your Resend API key for sending emails\n' +
				'- EMAIL_FROM: Your email address for sending emails',
			'Next Steps',
		)

		outro(color.blue('Setup completed successfully! 🎉'))
	} catch (error) {
		console.error(color.red('An error occurred during setup:'), error)
		process.exit(1)
	}
}

// Start the setup process
void setup()
