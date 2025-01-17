import { logger, schemaTask } from '@trigger.dev/sdk/v3'
import * as v from 'valibot'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'

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
	},
})
