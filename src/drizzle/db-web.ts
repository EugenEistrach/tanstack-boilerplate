import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'

import { schema } from './schemas/schema'
import { env } from '@/lib/server/env.server'

if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
	throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set')
}

let client = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
