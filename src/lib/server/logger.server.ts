import pino from 'pino'

const nodeEnv = process.env['NODE_ENV']
const logLevel = process.env['LOG_LEVEL'] ?? 'info'
const appName = process.env['APP_NAME']

export const logger = pino({
	transport:
		appName && nodeEnv !== 'production'
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
		app: appName ?? 'app',

		env: nodeEnv,
	},
	level: logLevel,
})
