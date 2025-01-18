import pino from 'pino'

const nodeEnv = process.env['NODE_ENV']
const logLevel = process.env['LOG_LEVEL'] ?? 'info'
const appName = process.env['APP_NAME']

export const logger = pino({
	base: {
		app: appName ?? 'app',
		env: nodeEnv,
	},
	level: logLevel,

	formatters: {
		level: (label) => ({ level: label.toUpperCase() }),
	},
	timestamp: pino.stdTimeFunctions.isoTime,
})
