import pino from 'pino'

import { env } from '@/lib/server/env.server'

export const logger = pino({
	transport:
		env.NODE_ENV !== 'production'
			? {
					target: 'pino-pretty',
					options: {
						colorize: true,
						ignore: 'pid,hostname', // Hide noisy fields
						translateTime: 'HH:MM:ss',
						messageFormat: '{msg}',
					},
				}
			: undefined,

	base: {
		app: env.APP_NAME,
		env: env.NODE_ENV,
	},
	level: env.LOG_LEVEL,
})
