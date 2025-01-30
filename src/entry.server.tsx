/// <reference types="vinxi/types/server" />
import Headers from '@mjackson/headers'

import { getRouterManifest } from '@tanstack/start/router-manifest'
import {
	createStartHandler,
	defaultStreamHandler,
} from '@tanstack/start/server'
import { migrate } from 'drizzle-orm/libsql/migrator'

import { db } from './drizzle/db'
import { createRouter } from './router'
import { setLanguageTag } from '@/lib/paraglide/runtime'
import { env } from '@/lib/server/env.server'
import { detectLanguage } from '@/lib/server/i18n.server'
import { logger } from '@/lib/server/logger.server'

import '@/lib/server/middleware.server'

if (env.MOCKS) {
	logger.info('Loading mock data for development')
	await import('./tests/mocks/setupMsw')
}

// migrate db
try {
	logger.info('Starting database migration')
	await migrate(db, {
		migrationsFolder: './src/drizzle/migrations',
	})

	logger.info('Database migration completed successfully')
} catch (err) {
	logger.error({ operation: 'dbMigration', err }, 'Database migration failed')
	throw err
}

const handler = createStartHandler({
	createRouter,
	getRouterManifest,
})((ctx) => {
	const language = detectLanguage(ctx.request)
	logger.debug(
		{ language, url: ctx.request.url },
		'Language detected for request',
	)

	const responseHeaders = new Headers(ctx.responseHeaders)
	setLanguageTag(() => language)
	responseHeaders.append('Set-Cookie', `lang=${language}; Path=/;`)

	logger.trace(
		{ language, url: ctx.request.url, method: ctx.request.method },
		'Processing stream handler request',
	)

	return defaultStreamHandler({
		...ctx,
		responseHeaders,
	})
})

logger.info('Server handler initialized successfully')

export default handler
