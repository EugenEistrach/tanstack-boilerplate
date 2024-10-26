/// <reference types="vinxi/types/server" />
import Headers from '@mjackson/headers'
import { type AnyRouter } from '@tanstack/react-router'
import { getRouterManifest } from '@tanstack/start/router-manifest'
import {
	createStartHandler,
	defaultStreamHandler,
} from '@tanstack/start/server'

import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

import { type HandlerCallback } from 'node_modules/@tanstack/start/dist/esm/server/defaultStreamHandler'
import { db } from './drizzle/db'
import {
	type AvailableLanguageTag,
	availableLanguageTags,
	setLanguageTag,
} from './lib/paraglide/runtime'
import { createRouter } from './router'

// migrate db
migrate(db, {
	migrationsFolder: './src/drizzle/migrations',
})

console.log('DB migrated')

const isSupportedLanguage = (
	language: string,
): language is AvailableLanguageTag => {
	return availableLanguageTags.includes(language as any)
}

const detectLanguage = (request: Request) => {
	const headers = new Headers(request.headers)

	const cookieLanguage = headers.cookie.get('lang')

	if (cookieLanguage && isSupportedLanguage(cookieLanguage)) {
		return cookieLanguage
	}

	const acceptLanguage =
		headers.acceptLanguage.languages.find(isSupportedLanguage)

	if (acceptLanguage) {
		return acceptLanguage
	}

	return availableLanguageTags[0]
}

const customStreamHandler: HandlerCallback<AnyRouter> = (ctx) => {
	const language = detectLanguage(ctx.request)
	const responseHeaders = new Headers(ctx.responseHeaders)
	setLanguageTag(() => language)
	responseHeaders.append('Set-Cookie', `lang=${language}; Path=/;`)

	return defaultStreamHandler({
		...ctx,
		responseHeaders,
	})
}

export default createStartHandler({
	createRouter,
	getRouterManifest,
})(customStreamHandler)
