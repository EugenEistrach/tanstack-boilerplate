import { logger, schemaTask, task, wait } from '@trigger.dev/sdk/v3'
import * as v from 'valibot'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'
import { env } from '@/lib/server/env.server'

const valibotParser = v.parser(
	v.object({
		email: v.string(),
		name: v.string(),
	}),
)

export const exaxpleTask = schemaTask({
	id: 'example-task-create-user',
	maxDuration: 300,
	schema: valibotParser,
	run: async (payload) => {
		logger.log('env', {
			LOCAL_DATABASE_PATH: env.LOCAL_DATABASE_PATH,
			TURSO_DATABASE_URL: env.TURSO_DATABASE_URL,
			TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
			ENABLE_EMBEDDED_DB: env.ENABLE_EMBEDDED_DB,
			NODE_ENV: env.NODE_ENV,
			LOG_LEVEL: env.LOG_LEVEL,
			APP_NAME: env.APP_NAME,
		})

		try {
			const newUser = await db
				.insert(UserTable)
				.values({
					id: crypto.randomUUID(),
					name: payload.name,
					email: payload.email,
					emailVerified: false,
				})
				.returning()

			logger.log('New user created', { newUser })
		} catch (error) {
			logger.error('Error creating user', { error })
		}
	},
})

export const exaxpleTask2 = schemaTask({
	id: 'example-task-create-user-2',
	maxDuration: 300,
	schema: valibotParser,
	run: async (payload) => {
		logger.log('env', {
			LOCAL_DATABASE_PATH: env.LOCAL_DATABASE_PATH,
			TURSO_DATABASE_URL: env.TURSO_DATABASE_URL,
			TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
			ENABLE_EMBEDDED_DB: env.ENABLE_EMBEDDED_DB,
			NODE_ENV: env.NODE_ENV,
			LOG_LEVEL: env.LOG_LEVEL,
			APP_NAME: env.APP_NAME,
		})

		console.log('env', {
			LOCAL_DATABASE_PATH: env.LOCAL_DATABASE_PATH,
			TURSO_DATABASE_URL: env.TURSO_DATABASE_URL,
			TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN,
			ENABLE_EMBEDDED_DB: env.ENABLE_EMBEDDED_DB,
			NODE_ENV: env.NODE_ENV,
			LOG_LEVEL: env.LOG_LEVEL,
			APP_NAME: env.APP_NAME,
		})
	},
})

export const exaxpleTask3 = task({
	id: 'example-task-create-user-3',
	maxDuration: 300,
	run: async (payload) => {
		logger.log('payload', {
			payload,
		})

		await wait.for({ seconds: 1 })

		logger.info('trace')
		logger.debug
	},
})
