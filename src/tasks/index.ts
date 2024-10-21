import { env } from '../lib/env.server'

export const jobConfig = {
	connection: {
		url: env.REDIS_URL,
	},
}
