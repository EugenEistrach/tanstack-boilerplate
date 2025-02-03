import fs from 'fs'

import { humanId } from '@inlang/sdk'
import chalk from 'chalk'
import { glob } from 'glob'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as m from '@/lib/paraglide/messages'

interface MessageKeyMap {
	oldKey: string
	newKey: string
	files: string[]
}

interface MessageFileContent {
	[key: string]: string
}

async function loadMessageFiles(): Promise<{
	[filepath: string]: MessageFileContent
}> {
	const messageFiles = await glob('./messages/*.json')
	const contents: { [filepath: string]: MessageFileContent } = {}

	for (const file of messageFiles) {
		const content = JSON.parse(fs.readFileSync(file, 'utf-8'))
		contents[file] = content
	}

	return contents
}

function generateKeyMap(messages: MessageFileContent): MessageKeyMap[] {
	const keyMap: MessageKeyMap[] = []

	for (const oldKey of Object.keys(messages)) {
		if (oldKey === '$schema') continue

		const newKey = humanId()
		keyMap.push({
			oldKey,
			newKey,
			files: [],
		})
	}

	return keyMap
}

async function findKeyUsages(keyMap: MessageKeyMap[]): Promise<void> {
	const files = await glob('src/**/*.{ts,tsx}')

	for (const file of files) {
		const content = fs.readFileSync(file, 'utf-8')

		for (const mapping of keyMap) {
			// Look for various usage patterns similar to the reference script
			const patterns = [
				`(?:m|messages)\\.${mapping.oldKey}\\(`,
				`(?:m|messages)\\.${mapping.oldKey}\\s+as\\b`,
				`(?:m|messages)\\.${mapping.oldKey},`,
				`(?:m|messages)\\.${mapping.oldKey}}`,
				`['"]${mapping.oldKey}['"]`, // Also check for string literals
			]

			const combinedPattern = new RegExp(patterns.join('|'), 'g')
			if (content.match(combinedPattern)) {
				mapping.files.push(file)
			}
		}
	}
}

async function updateMessageFiles(
	messageFiles: { [filepath: string]: MessageFileContent },
	keyMap: MessageKeyMap[],
): Promise<void> {
	for (const [filepath, content] of Object.entries(messageFiles)) {
		const newContent: MessageFileContent = {}

		for (const [key, value] of Object.entries(content)) {
			const mapping = keyMap.find((m) => m.oldKey === key)
			if (mapping) {
				newContent[mapping.newKey] = value
			} else {
				newContent[key] = value // Keep non-mapped keys (like $schema)
			}
		}

		fs.writeFileSync(filepath, JSON.stringify(newContent, null, 2))
		console.log(chalk.green(`Updated message file: ${filepath}`))
	}
}

async function updateSourceFiles(keyMap: MessageKeyMap[]): Promise<void> {
	for (const mapping of keyMap) {
		for (const file of mapping.files) {
			let content = fs.readFileSync(file, 'utf-8')

			// Replace all occurrences of the old key with the new key
			const patterns = [
				{
					// Replace only when preceded by messages. or m.
					search: new RegExp(
						`((?:messages|m)\\.)${mapping.oldKey}(\\s*\\(|\\s+as\\b|(?=,|}))`,
						'g',
					),
					replace: `$1${mapping.newKey}$2`,
				},
			]

			for (const pattern of patterns) {
				content = content.replace(pattern.search, pattern.replace)
			}

			fs.writeFileSync(file, content)
			console.log(chalk.green(`Updated source file: ${file}`))
		}
	}
}

async function main() {
	try {
		console.log(chalk.blue('Starting message key migration...'))

		// Load all message files
		const messageFiles = await loadMessageFiles()
		const messageFile = Object.values(messageFiles)[0]

		if (!messageFile) {
			throw new Error('No message files found')
		}

		// Generate new keys for all existing messages
		const keyMap = generateKeyMap(messageFile) // Use first file as reference

		// Find all usages of the keys in the codebase
		await findKeyUsages(keyMap)

		// Update message files with new keys
		await updateMessageFiles(messageFiles, keyMap)

		// Update source files with new keys
		await updateSourceFiles(keyMap)

		// Output migration report
		console.log('\n📊', chalk.bold('Migration Report'), '📊')
		console.log(`Total keys migrated: ${keyMap.length}`)
		console.log(
			`Files affected: ${new Set(keyMap.flatMap((m) => m.files)).size}`,
		)

		console.log(chalk.green('\n✨ Migration completed successfully!'))
	} catch (error) {
		console.error(chalk.red('Error during migration:'), error)
		process.exit(1)
	}
}

void main()
