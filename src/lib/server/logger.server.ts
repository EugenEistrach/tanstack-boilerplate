import pino from 'pino'

export const logger = pino({
	transport:
		process.env['NODE_ENV'] !== 'production'
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
		app: process.env['APP_NAME'],
		env: process.env['NODE_ENV'],
	},
	level: process.env['LOG_LEVEL'],
})
