#!/usr/bin/env node

import crypto from 'crypto'
import net from 'net'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { intro, outro, spinner, log, isCancel } from '@clack/prompts'
import { execa, type ExecaChildProcess } from 'execa'
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.join(__dirname, '..')
const testDir = path.join(os.tmpdir(), `create-et-app-test-${Date.now()}`)
const randomSuffix = crypto.randomBytes(2).toString('hex')
const projectName = `test-app-${randomSuffix}`

// Track if we're in cleanup to prevent multiple cleanups
let isCleaningUp = false

// Find a free port in the range 3001-3999
async function findFreePort() {
	return new Promise((resolve, reject) => {
		const server = net.createServer()
		server.unref()
		server.on('error', reject)
		server.listen(0, () => {
			const { port } = server.address() as net.AddressInfo
			server.close(() => resolve(port))
		})
	})
}

async function cleanup(devServer?: ExecaChildProcess, port?: number) {
	if (isCleaningUp) return
	isCleaningUp = true

	try {
		if (devServer) {
			log.info('Stopping dev server...')
			const killed = devServer.kill('SIGTERM')

			if (!killed) {
				log.warn('Failed to stop dev server gracefully, forcing...')
				if (port) {
					try {
						if (process.platform === 'win32') {
							await execa('taskkill', ['/F', '/IM', 'node.exe'])
						} else {
							await execa('pkill', ['-f', `node.*${port}`])
						}
					} catch (error) {
						log.error(`Force kill failed: ${(error as Error).message}`)
					}
				}
			}
		}

		// Remove test directory from temp
		if (fs.existsSync(testDir)) {
			log.info('Cleaning up test directory...')
			try {
				await fs.remove(testDir)
			} catch (error) {
				log.error(
					`Failed to remove temp directory: ${(error as Error).message}`,
				)
			}
		}

		// Unlink global package
		log.info('Unlinking package...')
		await execa('pnpm', ['unlink'], { cwd: packageRoot }).catch((error) => {
			log.error(`Unlink error: ${error.message}`)
		})
	} catch (error) {
		log.error(`Cleanup error: ${(error as Error).message}`)
	} finally {
		isCleaningUp = false
	}
}

async function waitForServer(
	url: string,
	maxAttempts = 30,
) {
	for (let i = 0; i < maxAttempts; i++) {
		try {
			const response = await fetch(url)
			if (response.ok) {
				const html = await response.text()
				const titleMatch = html.match(/<title>(.*?)<\/title>/)
				const title = titleMatch ? titleMatch[1] : undefined
				return { ready: true, title }
			}
		} catch {
			// Silent fail, we'll log progress via spinner
		}
		await new Promise((resolve) => setTimeout(resolve, 1000))
	}
	return { ready: false }
}

async function verify() {
	intro('🧪 Verifying create-et-app')

	const s = spinner()
	let devServer: ExecaChildProcess | undefined
	let port: number | undefined

	// Setup signal handlers
	const handleSignal = async () => {
		log.info('\n🛑 Verification cancelled')
		await cleanup(devServer, port)
		process.exit(1)
	}

	process.on('SIGINT', handleSignal)
	process.on('SIGTERM', handleSignal)

	try {
		// Clean up previous test directory and ensure package is unlinked
		s.start('Cleaning up previous test directory')
		await cleanup()
		s.stop('Previous test directory cleaned')

		// Find a free port
		s.start('Finding available port')
		port = await findFreePort()
		s.stop(`Found free port: ${port}`)

		// Build the package
		s.start('Building package')
		await execa('pnpm', ['build'], { cwd: packageRoot })
		s.stop('Package built')

		// Link the package globally
		s.start('Linking package')
		await execa('pnpm', ['link', '--global'], { cwd: packageRoot })
		s.stop('Package linked')

		// Create a test directory
		s.start('Creating test directory')
		await fs.ensureDir(testDir)
		s.stop('Test directory created')

		// Run create-et-app in test directory with the project name
		log.info('📦 Running create-et-app...')
		try {
			await execa('create-et-app', [projectName], {
				cwd: testDir,
				stdio: 'inherit',
				env: {
					...process.env,
					FORCE_COLOR: 'true',
				},
			})
		} catch (error) {
			log.error('Failed to run create-et-app')
			throw error
		}

		// Verify the project was created
		s.start('Verifying project creation')
		const projectDir = path.join(testDir, projectName)
		const packageJsonPath = path.join(projectDir, 'package.json')

		if (!fs.existsSync(projectDir)) {
			throw new Error(`Project directory ${projectDir} was not created`)
		}
		if (!fs.existsSync(packageJsonPath)) {
			throw new Error('package.json not found in created project')
		}
		s.stop('Project created successfully')

		// Add confirmation step
		log.info(`\n📂 Project created at: ${projectDir}`)
		log.info('Please inspect the project files if needed.')
		const { confirm } = await import('@clack/prompts')
		const shouldContinue = await confirm({
			message: 'Would you like to proceed with running the dev server?',
		})

		if (isCancel(shouldContinue) || !shouldContinue) {
			log.info('Verification cancelled by user')
			await cleanup()
			process.exit(0)
		}

		// Start the dev server with custom port
		s.start(`Starting dev server on port ${port}`)
		devServer = execa('pnpm', ['dev', '--port', port.toString()], {
			cwd: projectDir,
			stdio: 'pipe',
			killSignal: 'SIGKILL',
		})

		// Wait for server to start
		let serverStarted = false
		for (let i = 1; i <= 30; i++) {
			s.start(`Waiting for server to start (${i}/30)`)
			const { ready, title } = await waitForServer(`http://localhost:${port}`)
			if (ready) {
				serverStarted = true
				s.stop(`Server started successfully - Page title: "${title}"`)
				break
			}
			if (i === 30) {
				throw new Error('Server failed to start within timeout')
			}
		}

		if (!serverStarted) {
			throw new Error('Server failed to start')
		}

		// Test the endpoint
		s.start('Testing endpoint')
		const response = await fetch(`http://localhost:${port}`)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		s.stop('Endpoint test successful')

		// Clean up before showing success message
		s.start('Cleaning up')
		await cleanup(devServer, port)
		devServer = undefined
		s.stop('Cleanup complete')

		// Show completion message with next steps
		outro(`✅ Verification completed successfully!`)
		process.exit(0)
	} catch (error) {
		if (isCancel(error)) {
			log.info('\n🛑 Verification cancelled')
		} else if (error instanceof Error) {
			log.error(`Error: ${error.message}`)
		} else {
			log.error('Unknown error occurred')
		}

		// Ensure cleanup happens
		s.start('Cleaning up after error')
		await cleanup(devServer, port)
		devServer = undefined
		s.stop('Cleanup complete')

		process.exit(1)
	} finally {
		// Remove signal handlers
		process.off('SIGINT', handleSignal)
		process.off('SIGTERM', handleSignal)
	}
}

// Handle unexpected errors
process.on('uncaughtException', async (error) => {
	log.error(`Unexpected error: ${error.message}`)
	await cleanup()
	process.exit(1)
})

process.on('unhandledRejection', async (error) => {
	log.error(
		`Unhandled rejection: ${error instanceof Error ? error.message : 'Unknown error'}`,
	)
	await cleanup()
	process.exit(1)
})

verify().catch(async (error) => {
	log.error('Verification failed')
	if (error instanceof Error) {
		log.error(error.message)
	}
	await cleanup()
	process.exit(1)
})
