import { execSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { intro, outro, text, spinner, note, multiselect } from '@clack/prompts'
import color from 'picocolors'
import {
	email,
	string,
	array,
	object,
	parse,
	custom,
	minLength,
	union,
	literal,
} from 'valibot'

const setupSchema = object({
	appName: string([
		minLength(1, 'App name is required'),
		custom(
			(value) => /^[a-z0-9-]+$/.test(value),
			'App name can only contain lowercase letters, numbers, and dashes',
		),
	]),
	adminEmails: string([
		minLength(1, 'At least one admin email is required'),
		custom((value) => {
			const emails = value.split(',').map((e) => e.trim())
			return emails.every((e) => email().safeParse(e).success)
		}, 'Invalid email format'),
	]),
	applicationUrl: string([
		minLength(1, 'Application URL is required'),
		custom((value) => {
			try {
				new URL(value)
				return true
			} catch {
				return false
			}
		}, 'Invalid URL format'),
	]),
	oauthProviders: array(union([literal('github'), literal('discord')]), [
		custom(
			(value) => value.length > 0,
			'At least one OAuth provider is required',
		),
	]),
})

async function openBrowser(url) {
	const platform = process.platform
	const cmd =
		platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open'
	execSync(`${cmd} ${url}`)
}

async function setupGitHubOAuth(appName, applicationUrl) {
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
		validate: (value) => {
			if (!value) return 'Client ID is required'
		},
	})

	const clientSecret = await text({
		message: 'Enter your GitHub Client Secret',
		validate: (value) => {
			if (!value) return 'Client Secret is required'
		},
	})

	s.stop('GitHub OAuth configured')
	return { clientId, clientSecret }
}

async function setupDiscordOAuth(appName, applicationUrl) {
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
		validate: (value) => {
			if (!value) return 'Client ID is required'
		},
	})

	const clientSecret = await text({
		message: 'Enter your Discord Client Secret',
		validate: (value) => {
			if (!value) return 'Client Secret is required'
		},
	})

	s.stop('Discord OAuth configured')
	return { clientId, clientSecret }
}

async function setup() {
	try {
		intro(color.blue('TanStack Boilerplate Setup'))

		const defaultAppName = path.basename(process.cwd())
		const s = spinner()

		// Basic setup questions
		const appName = await text({
			message: 'What is your app name?',
			defaultValue: defaultAppName,
			placeholder: 'my-awesome-app',
			validate: (value) => {
				if (!/^[a-z0-9-]+$/.test(value)) {
					return 'App name can only contain lowercase letters, numbers, and dashes'
				}
			},
		})

		const adminEmails = await text({
			message: 'Enter admin email addresses (comma-separated)',
			defaultValue: 'admin@example.com',
			validate: (value) => {
				const emails = value.split(',').map((e) => e.trim())
				if (
					!emails.every((e) => {
						try {
							parse(email(), e)
							return true
						} catch {
							return false
						}
					})
				) {
					return 'Please enter valid email addresses'
				}
			},
		})

		const applicationUrl = await text({
			message: 'Enter your application URL',
			defaultValue: 'http://localhost:3000',
			validate: (value) => {
				try {
					new URL(value)
				} catch {
					return 'Please enter a valid URL'
				}
			},
		})

		// OAuth provider selection
		const oauthProviders = await multiselect({
			message: 'Select OAuth providers to configure (at least one required)',
			options: [
				{ value: 'github', label: 'GitHub' },
				{ value: 'discord', label: 'Discord' },
			],
			required: true,
			validate: (value) => {
				if (value.length === 0) return 'At least one OAuth provider is required'
			},
		})

		// Validate all inputs
		const config = parse(setupSchema, {
			appName,
			adminEmails,
			applicationUrl,
			oauthProviders,
		})

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
		} catch (error) {
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

		const repoUrl = await text({
			message: 'Enter your GitHub repository URL',
			validate: (value) => {
				if (!value) return 'Repository URL is required'
				if (!value.startsWith('https://github.com/'))
					return 'Invalid GitHub repository URL'
			},
		})

		execSync('git remote remove origin || true') // Remove origin if it exists
		execSync(`git remote add origin ${repoUrl}`)
		execSync('git push -u origin main')
		s.stop('Git repository initialized and pushed to GitHub')

		// Set up OAuth providers
		const oauthConfig = {}

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

		outro(color.green('Setup completed successfully! 🎉'))
	} catch (error) {
		console.error(color.red('An error occurred during setup:'), error)
		process.exit(1)
	}
}

setup()
