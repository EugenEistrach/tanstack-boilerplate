import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { execa } from 'execa'
import { glob } from 'glob'
import * as m from '@/lib/paraglide/messages'

interface MessageUsage {
	key: string
	files: string[]
	usageCount: number
	unused: boolean
}

interface MessageAnalysis {
	[key: string]: MessageUsage
}

interface MessageFileBackup {
	path: string
	content: string
}

async function findMessageUsages(): Promise<MessageAnalysis> {
	// Read messages file
	const messagesPath = path.join(process.cwd(), 'messages', 'en.json')
	const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'))

	// Initialize analysis object with all keys
	const analysis: MessageAnalysis = {}
	for (const key of Object.keys(messages)) {
		if (key === '$schema') continue // Skip schema key
		analysis[key] = {
			key,
			files: [],
			usageCount: 0,
			unused: true,
		}
	}

	// Find all TypeScript/TSX files
	const files = await glob('src/**/*.{ts,tsx}')

	// Search for usages in each file
	for (const file of files) {
		const content = fs.readFileSync(file, 'utf-8')

		for (const key of Object.keys(analysis)) {
			// Look for various usage patterns:
			// 1. m.key_name() or messages.key_name()
			// 2. m.key_name as or messages.key_name as
			// 3. m.key_name, or messages.key_name,
			// 4. m.key_name} or messages.key_name}
			const patterns = [
				`(?:m|messages)\\.${key}\\(`, // Function call
				`(?:m|messages)\\.${key}\\s+as\\b`, // Used in type/const assertions
				`(?:m|messages)\\.${key},`, // Used in object/array
				`(?:m|messages)\\.${key}}`, // Used in JSX/object destructuring
			]
			const combinedPattern = new RegExp(patterns.join('|'), 'g')
			const matches = content.match(combinedPattern)

			if (matches?.length && key in analysis) {
				const entry = analysis[key] as MessageUsage
				entry.files.push(file)
				entry.usageCount += matches.length
				entry.unused = false
			}
		}
	}

	return analysis
}

function printReport(analysis: MessageAnalysis, showUsed = false) {
	console.log('\n📊', chalk.bold('i18n Message Usage Analysis'), '📊\n')

	// Get statistics
	const totalKeys = Object.keys(analysis).length
	const unusedKeys = Object.values(analysis).filter((m) => m.unused).length
	const usedKeys = totalKeys - unusedKeys

	// Print summary
	console.log(chalk.blue('Summary:'))
	console.log(`Total messages: ${chalk.bold(totalKeys)}`)
	console.log(`Used messages: ${chalk.green(usedKeys)}`)
	console.log(`Unused messages: ${chalk.yellow(unusedKeys)}`)

	// Sort by usage count
	const sorted = Object.values(analysis).sort(
		(a, b) => b.usageCount - a.usageCount,
	)

	// Print used messages only if flag is passed
	if (showUsed) {
		console.log(chalk.green('\nUsed Messages:'))
		sorted
			.filter((m) => !m.unused)
			.forEach((message) => {
				console.log(`\n${chalk.bold(message.key)}:`)
				console.log(`  Usage count: ${message.usageCount}`)
				console.log('  Files:')
				message.files.forEach((file) => {
					console.log(`    - ${file}`)
				})
			})
	}

	// Print unused messages
	if (unusedKeys > 0) {
		console.log(chalk.yellow('\nUnused Messages:'))
		sorted
			.filter((m) => m.unused)
			.forEach((message) => {
				console.log(`  - ${message.key}`)
			})
	}
}

async function backupMessageFiles(): Promise<MessageFileBackup[]> {
	const messageFiles = await glob('messages/*.json')
	return messageFiles.map((path) => ({
		path,
		content: fs.readFileSync(path, 'utf-8'),
	}))
}

async function restoreMessageFiles(backups: MessageFileBackup[]) {
	for (const backup of backups) {
		fs.writeFileSync(backup.path, backup.content)
	}
	console.log(chalk.green('Restored message files to their original state'))
}

async function cleanUnusedKeys(analysis: MessageAnalysis) {
	const messageFiles = await glob('messages/*.json')
	let totalRemoved = 0

	for (const file of messageFiles) {
		const content = JSON.parse(fs.readFileSync(file, 'utf-8'))
		const unusedKeys = Object.values(analysis)
			.filter((m) => m.unused)
			.map((m) => m.key)

		let removedCount = 0
		for (const key of unusedKeys) {
			if (key in content) {
				delete content[key]
				removedCount++
			}
		}

		if (removedCount > 0) {
			fs.writeFileSync(file, JSON.stringify(content, null, '\t') + '\n')
			console.log(
				chalk.green(`Removed ${removedCount} unused keys from ${file}`),
			)
			totalRemoved += removedCount
		}
	}

	if (totalRemoved > 0) {
		console.log(chalk.green(`\nTotal keys removed: ${totalRemoved}`))
	} else {
		console.log(chalk.blue('\nNo unused keys to remove'))
	}

	return totalRemoved > 0
}

async function verifyChanges(): Promise<boolean> {
	try {
		// Run paraglide compile
		console.log(chalk.blue('\nCompiling translations...'))
		await execa('pnpm', ['build:paraglide'])

		// Run typecheck
		console.log(chalk.blue('\nRunning typecheck...'))
		await execa('pnpm', ['typecheck'])

		return true
	} catch (error) {
		console.error(chalk.red('\nVerification failed:'))
		if (error instanceof Error) {
			console.error(error.message)
		}
		return false
	}
}

async function main() {
	try {
		const shouldClean = process.argv.includes('--clean')
		console.log(chalk.blue('\nDebug: Command arguments:'), process.argv)
		console.log(chalk.blue('Debug: Should clean:'), shouldClean)

		const analysis = await findMessageUsages()

		if (!shouldClean) {
			console.log(chalk.blue('Debug: Running in analysis-only mode'))
			printReport(analysis, false)
			return
		}

		console.log(chalk.blue('Debug: Running in clean mode'))
		console.log(chalk.yellow('\nCleaning unused keys...'))

		// Clean unused keys
		const backups = await backupMessageFiles()
		const madeChanges = await cleanUnusedKeys(analysis)

		console.log(chalk.blue('Debug: Changes made:'), madeChanges)

		if (madeChanges) {
			// Verify changes
			console.log(chalk.blue('Debug: Verifying changes...'))
			const isValid = await verifyChanges()

			if (!isValid) {
				console.log(
					chalk.yellow('\nReverting changes due to verification failure...'),
				)
				await restoreMessageFiles(backups)
				process.exit(1)
			}

			console.log(
				chalk.green('\n✨ All changes verified and applied successfully!'),
			)
		}
	} catch (error) {
		console.error(chalk.red('Error analyzing i18n messages:'), error)
		process.exit(1)
	}
}

void main()
