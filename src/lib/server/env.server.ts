import { type } from 'arktype'

// Schema definition
export const environmentSchema = type({
	'CI?': type('string >= 1').pipe((val) => val === 'true'),
	'MOCKS?': type('string >= 1').pipe((val) => val === 'true'),
	'NODE_ENV?': 'string >= 1',
	APPLICATION_URL: 'string >= 1',
	'TURSO_DATABASE_URL?': 'string',
	'TURSO_AUTH_TOKEN?': 'string',
	LOCAL_DATABASE_PATH: "string = 'db.sqlite'",
	'GITHUB_CLIENT_ID?': 'string >= 1',
	'GITHUB_CLIENT_SECRET?': 'string >= 1',
	SESSION_SECRET: 'string >= 1',
	'RESEND_API_KEY?': 'string >= 1',
	'EMAIL_FROM?': 'string >= 1',
	'ADMIN_USER_EMAILS?': type('string >= 1').pipe(
		(val) => (val || '').split(',').map((s) => s.trim()),
		type('string.email[]'),
	),
	'API_KEY?': 'string >= 1',
	'ENABLE_ADMIN_APPROVAL?': type('string >= 1').pipe((val) => val === 'true'),
	LOG_LEVEL: "string >= 1 = 'info'",
})

// Type inference
export type Env = typeof environmentSchema.infer

const parseEnv = () => {
	const result = environmentSchema(process.env)

	if (result instanceof type.errors) {
		throw new Error(`🚨 Invalid environment variables.\n ${result.summary}`)
	}

	return result
}

// Cache for parsed env
let parsedEnv: Env | null = null

export const env = new Proxy({} as Env, {
	get(target, prop) {
		if (typeof window !== 'undefined') {
			throw new Error(
				'❌ Attempted to access server-side environment variable on the client',
			)
		}

		// Lazy parse env if not already parsed
		if (!parsedEnv) {
			parsedEnv = parseEnv()
		}

		return Reflect.get(parsedEnv, prop)
	},
})
