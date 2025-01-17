import pino from 'pino'

const nodeEnv = process.env['NODE_ENV'] ?? 'development'
const logLevel = process.env['LOG_LEVEL'] ?? 'info'
const appName = process.env['APP_NAME'] ?? 'app'

export const logger = pino({
	transport:
		nodeEnv !== 'production'
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
		app: appName,
		env: nodeEnv,
	},
	level: logLevel,
})
