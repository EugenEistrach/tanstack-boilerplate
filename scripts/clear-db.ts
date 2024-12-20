import 'dotenv/config'

import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

console.log('Clearing database...')

const databaseUrl = process.env['DATABASE_URL']
if (!databaseUrl) {
	console.error('DATABASE_URL environment variable is not set.')
	process.exit(1)
}

const databasePath = resolve(process.cwd(), `${databaseUrl}*`)

try {
	execSync(`rm -f ${databasePath}`)
	console.log('Database files deleted successfully.')
} catch (error) {
	console.error('Error deleting the database files:', error)
}
