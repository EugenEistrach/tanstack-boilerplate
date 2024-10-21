import { exec } from 'node:child_process'
import fs from 'node:fs/promises'

const TEMP_DB_PATH = './scripts/.tmp/db.sql'
const OUTPUT_SQL_PATH = './scripts/.dump/db.sql'

async function runCommand(command: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout) => {
			if (error) reject(error)
			resolve(stdout)
		})
	})
}

async function dumpDb() {
	try {
		// Set up temporary database
		await fs.mkdir(new URL('./.tmp', import.meta.url), {
			recursive: true,
		})
		process.env['DATABASE_URL'] = `${TEMP_DB_PATH}`

		// Dump the database to SQL
		const sqlDump = await runCommand(`sqlite3 ${TEMP_DB_PATH} .dump`)

		// Filter out everything except INSERT statements
		const insertStatements = sqlDump
			.split('\n')
			.filter((line) => line.startsWith('INSERT INTO'))
			.join('\n--> statement-breakpoint\n')

		// Write INSERT statements to the output file
		await fs.mkdir(new URL('./.dump', import.meta.url), {
			recursive: true,
		})
		await fs.writeFile(OUTPUT_SQL_PATH, insertStatements)

		console.log(`Dump SQL created at ${OUTPUT_SQL_PATH}`)
	} catch (error) {
		console.error('Error dumping database:', error)
	} finally {
		// Clean up temporary database
		await fs
			.rm('./scripts/.tmp', { force: true, recursive: true })
			.catch(() => {})
	}
}

void dumpDb()
