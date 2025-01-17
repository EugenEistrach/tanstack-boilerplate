import 'dotenv/config'

import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

console.log('Clearing database...')

const databaseUrl = process.env['LOCAL_DATABASE_PATH']
if (!databaseUrl) {
	console.error('LOCAL_DATABASE_PATH environment variable is not set.')
	process.exit(1)
}

const databasePath = resolve(process.cwd(), `${databaseUrl}*`)

try {
	execSync(`rm -f ${databasePath}`)
	console.log('Database files deleted successfully.')
} catch (error) {
	console.error('Error deleting the database files:', error)
}
