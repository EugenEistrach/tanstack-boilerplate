import { serverEnv } from '../lib/env.server'

export const jobConfig = {
	connection: {
		url: serverEnv.REDIS_URL,
	},
}
