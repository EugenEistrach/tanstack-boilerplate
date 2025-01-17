import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { schema } from './schemas/schema'
import { env } from '@/lib/server/env.server'

const getDbClient = () => {
	// Case 1: Remote Turso DB with auth
	if (env.TURSO_DATABASE_URL && env.TURSO_AUTH_TOKEN) {
		// Case 1a: Remote only mode
		if (!env.ENABLE_EMBEDDED_DB) {
			console.info(
				{
					url: env.TURSO_DATABASE_URL,
					mode: 'remote-only',
				},
				'Initializing remote-only Turso database client',
			)
			return createClient({
				url: env.TURSO_DATABASE_URL,
				authToken: env.TURSO_AUTH_TOKEN,
			})
		}

		// Case 1b: Hybrid mode (local + remote sync)
		console.info(
			{
				localPath: env.LOCAL_DATABASE_PATH,
				syncUrl: env.TURSO_DATABASE_URL,
				mode: 'hybrid',
			},
			'Initializing hybrid database client with local file and remote sync',
		)
		return createClient({
			url: `file:${env.LOCAL_DATABASE_PATH}`,
			authToken: env.TURSO_AUTH_TOKEN,
			syncUrl: env.TURSO_DATABASE_URL,
			syncInterval: 60,
		})
	}

	// Case 2: Local-only mode
	console.info(
		{
			localPath: env.LOCAL_DATABASE_PATH,
			mode: 'local-only',
		},
		'Initializing local-only database client',
	)
	return createClient({
		url: `file:${env.LOCAL_DATABASE_PATH}`,
	})
}

const client = getDbClient()
export const db = drizzle(client, { schema })
