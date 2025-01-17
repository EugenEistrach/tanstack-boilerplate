import { logger, schemaTask, task, wait } from '@trigger.dev/sdk/v3'
import * as v from 'valibot'
// import { db } from '@/drizzle/db'
// import { UserTable } from '@/drizzle/schemas/auth-schema'
// import { env } from '@/lib/server/env.server'

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
		try {
			logger.log('New user created', { payload })
		} catch (error) {
			logger.error('Error creating user', { error })
		}
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
