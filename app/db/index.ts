import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import { env } from '../lib/env'
import * as schema from './schema'

export const sqlite = new Database(env.DATABASE_URL)

// Enable Write-Ahead Logging (WAL) mode to allow concurrent reads and writes
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, {
	schema,
})
