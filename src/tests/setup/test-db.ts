import { drizzle } from 'drizzle-orm/better-sqlite3'
import { schema } from '@/drizzle/schemas/schema'

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>
let drizzleDb: DrizzleDB | null = null

const testDbPath = process.env['TEST_DB_PATH']

if (!testDbPath) {
	throw new Error('TEST_DB_PATH is not set')
}

export const testDb = new Proxy({} as DrizzleDB, {
	get(_, prop) {
		// if we don't have a db or the db is not open, we need to create it
		if (!drizzleDb || !drizzleDb.$client.open) {
			drizzleDb = drizzle({
				connection: testDbPath,
				schema,
			})

			drizzleDb.$client.pragma('journal_mode = WAL')
		}
		return drizzleDb[prop as keyof DrizzleDB]
	},
})
