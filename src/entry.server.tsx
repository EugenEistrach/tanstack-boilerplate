/// <reference types="vinxi/types/server" />
import Headers from '@mjackson/headers'
import { type AnyRouter } from '@tanstack/react-router'
import { getRouterManifest } from '@tanstack/start/router-manifest'
import {
	createStartHandler,
	defaultStreamHandler,
} from '@tanstack/start/server'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { type HandlerCallback } from 'node_modules/@tanstack/start/dist/esm/server/defaultStreamHandler'

import { db } from './drizzle/db'
import { createRouter } from './router'
import { setLanguageTag } from '@/lib/paraglide/runtime'
import { env } from '@/lib/server/env.server'
import { detectLanguage } from '@/lib/server/i18n.server'
import { logger } from '@/lib/server/logger.server'

import '@/lib/server/middleware.server'

if (env.MOCKS) {
	logger.info('Loading mock data for development')
	await import('./tests/mocks')
}

// migrate db
try {
	logger.info('Starting database migration')
	await migrate(db, {
		migrationsFolder: './src/drizzle/migrations',
	})
	logger.info('Database migration completed successfully')
} catch (error) {
	logger.error({
		msg: 'Database migration failed',
		error,
		operation: 'dbMigration',
	})
	throw error
}

const customStreamHandler: HandlerCallback<AnyRouter> = (ctx) => {
	const language = detectLanguage(ctx.request)
	logger.debug({
		msg: 'Language detection',
		detectedLanguage: language,
		url: ctx.request.url,
	})

	const responseHeaders = new Headers(ctx.responseHeaders)
	setLanguageTag(() => language)
	responseHeaders.append('Set-Cookie', `lang=${language}; Path=/;`)

	logger.trace({
		msg: 'Stream handler execution',
		language,
		url: ctx.request.url,
		method: ctx.request.method,
	})

	return defaultStreamHandler({
		...ctx,
		responseHeaders,
	})
}

const handler = createStartHandler({
	createRouter,
	getRouterManifest,
})(customStreamHandler)

logger.info('Server handler initialized successfully')

export default handler
