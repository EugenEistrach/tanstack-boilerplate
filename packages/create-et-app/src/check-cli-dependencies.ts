import { confirm, note, log } from '@clack/prompts'
import { execa } from 'execa'
import { ensureNotCanceled, waitForCheck } from '@/utils.js'

export type VerificationResult = {
	isInstalled: boolean
	isLoggedIn: boolean
}

export type CliVerificationResults = Record<
	CliDependencyName,
	VerificationResult
>

export const cliDependencies = {
	fly: {
		name: 'Fly.io CLI',
		command: 'fly',
		installInstructions: [
			'Install Fly CLI:',
			'curl -L https://fly.io/install.sh | sh',
			'or',
			'brew install flyctl',
		],

		async checkInstalled() {
			try {
				await execa('fly', ['version'])
				return true
			} catch {
				return false
			}
		},

		async checkLoggedIn() {
			try {
				const { stdout } = await execa('fly', ['auth', 'whoami'])
				return stdout.length > 0
			} catch {
				return false
			}
		},

		async login() {
			await execa('fly', ['auth', 'login'])
		},
	},

	turso: {
		name: 'Turso CLI',
		command: 'turso',
		installInstructions: [
			'Install Turso CLI:',
			'brew install tursodatabase/tap/turso',
			'or',
			'curl -sSfL https://get.turso.tech/install.sh | sh',
		],

		async checkInstalled() {
			try {
				await execa('turso', ['--version'])
				return true
			} catch {
				return false
			}
		},

		async checkLoggedIn() {
			try {
				const { stdout } = await execa('turso', ['auth', 'token'])
				return !stdout.includes('You are not logged in')
			} catch {
				return false
			}
		},

		async login() {
			await execa('turso', ['auth', 'login'])
		},
	},

	gh: {
		name: 'GitHub CLI',
		command: 'gh',
		installInstructions: [
			'Install GitHub CLI:',
			'brew install gh',
			'or',
			'https://cli.github.com/manual/installation',
		],

		async checkInstalled() {
			try {
				await execa('gh', ['--version'])
				return true
			} catch {
				return false
			}
		},

		async checkLoggedIn() {
			try {
				const { stdout } = await execa('gh', ['auth', 'status'])
				return stdout.includes('Logged in')
			} catch {
				return false
			}
		},

		async login() {
			await execa('gh', ['auth', 'login'], {
				stdio: 'inherit',
			})
		},
	},

	trigger: {
		name: 'Trigger.dev CLI',
		command: 'trigger',
		installInstructions: [
			'Install Trigger.dev CLI:',
			'brew install triggerdev/trigger/trigger',
		],

		async checkInstalled() {
			return true
		},

		async checkLoggedIn() {
			try {
				const { stdout } = await execa('pnpm', [
					'dlx',
					'trigger.dev@latest',
					'whoami',
				])
				return !stdout.includes('failed')
			} catch {
				return false
			}
		},

		async login() {
			await execa('pnpm', ['dlx', 'trigger.dev@latest', 'login'], {
				stdio: 'inherit',
			})
		},
	},
} as const

export async function verifyCliDependencies(dependencies: CliDependencyName[]) {
	const results: CliVerificationResults = {} as CliVerificationResults

	for (const dep of dependencies) {
		const cli = cliDependencies[dep]
		results[dep] = { isInstalled: false, isLoggedIn: false }

		// Check if installed
		let isInstalled = await waitForCheck({
			action: async () => cli.checkInstalled(),
			waitingMessage: `Checking ${cli.name} installation`,
			successMessage: `${cli.name} installed ✅`,
			errorMessage: `${cli.name} not installed ❌`,
		})

		if (!isInstalled) {
			note(
				[
					`${cli.name} is required for automated setup of some features.`,
					'',
					'Installation instructions:',
					...cli.installInstructions,
				].join('\n'),
				`${cli.name} Not Found`,
			)

			const shouldWait = ensureNotCanceled(
				await confirm({
					message: `Would you like to install ${cli.name} now? (Setup will wait and verify again)`,
					initialValue: true,
				}),
			)

			if (shouldWait) {
				// Wait for installation and verify again
				note('Installing... Press Enter once installation is complete')
				await new Promise((resolve) => process.stdin.once('data', resolve))

				isInstalled = await waitForCheck({
					action: async () => cli.checkInstalled(),
					waitingMessage: `Checking ${cli.name} installation`,
					successMessage: `${cli.name} installed ✅`,
					errorMessage: `${cli.name} not installed ❌`,
				})

				if (!isInstalled) {
					note(
						`${cli.name} is still not available. Some features will require manual setup.`,
						'Setup Continues',
					)
					continue
				}
			} else {
				note(
					`Continuing without ${cli.name}. Some features will require manual setup.`,
					'Setup Continues',
				)
				continue
			}
		}

		results[dep].isInstalled = true

		// Check login status only if installed
		if (isInstalled) {
			const isLoggedIn = await waitForCheck({
				action: async () => cli.checkLoggedIn(),
				waitingMessage: `Checking ${cli.name} login status`,
				successMessage: `${cli.name} logged in ✅`,
				errorMessage: `${cli.name} not logged in ❌`,
			})

			if (!isLoggedIn) {
				const shouldLogin = ensureNotCanceled(
					await confirm({
						message: `Would you like to log in to ${cli.name} now?`,
						initialValue: true,
					}),
				)

				if (shouldLogin) {
					try {
						await cli.login()
						log.success(`Logged in to ${cli.name} ✅`)
						results[dep].isLoggedIn = true
					} catch (error) {
						if (error instanceof Error) {
							log.error(error.message)
						}
						note(
							`Failed to log in to ${cli.name}. Some features will require manual setup.`,
							'Login Failed',
						)
					}
				} else {
					note(
						`Continuing without ${cli.name} login. Some features will require manual setup.`,
						'Setup Continues',
					)
				}
			} else {
				results[dep].isLoggedIn = true
			}
		}
	}

	return results
}

export type CliDependencyName = keyof typeof cliDependencies
