/// <reference types="vinxi/types/server" />
import { getRouterManifest } from '@tanstack/start/router-manifest'
import {
	createStartHandler,
	defaultStreamHandler,
} from '@tanstack/start/server'

import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import { db } from './drizzle/db'
import { createRouter } from './router'

// migrate db
migrate(db, {
	migrationsFolder: './src/drizzle/migrations',
})

console.log('DB migrated')

export default createStartHandler({
	createRouter,
	getRouterManifest,
})(defaultStreamHandler)
