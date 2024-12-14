import path from 'node:path'
import fsExtra from 'fs-extra'
import { afterEach, beforeEach } from 'vitest'
import { BASE_DATABASE_PATH } from './global-setup'

// SQLite just needs the path, not file: prefix
const databaseFile = `./src/tests/drizzle/data.${process.env['VITEST_POOL_ID'] || 0}.sqlite`
const databasePath = path.join(process.cwd(), databaseFile)
process.env['DATABASE_URL'] = databasePath

beforeEach(async () => {
	process.env['DATABASE_URL'] = databasePath
	await ensureNoDatabaseFiles()
	console.log(`Copying ${BASE_DATABASE_PATH} database to ${databasePath}`)
	await fsExtra.copyFile(BASE_DATABASE_PATH, databasePath)
})

afterEach(async () => {
	await ensureNoDatabaseFiles()
})

async function ensureNoDatabaseFiles() {
	const { db } = await import('@/drizzle/db')

	if (db.$client.open) {
		db.$client.close()
	}

	const filesToRemove = [
		databasePath,
		`${databasePath}-wal`,
		`${databasePath}-shm`,
	]

	for (const file of filesToRemove) {
		await fsExtra.remove(file).catch(() => {
			// Ignore errors if files don't exist
		})
	}
}
