import * as v from 'valibot'

// Schema definition
const serverSchema = v.object({
	APP_NAME: v.pipe(v.string(), v.nonEmpty()),
	CI: v.optional(
		v.pipe(
			v.string(),
			v.transform((val) => val === 'true'),
		),
	),
	MOCKS: v.optional(
		v.pipe(
			v.string(),
			v.transform((val) => val === 'true'),
		),
	),
	NODE_ENV: v.optional(v.string()),
	BASE_URL: v.pipe(v.string(), v.nonEmpty()),
	DATABASE_URL: v.pipe(v.string(), v.nonEmpty()),
	REDIS_URL: v.pipe(v.string(), v.nonEmpty()),

	GITHUB_CLIENT_ID: v.optional(v.string()),
	GITHUB_CLIENT_SECRET: v.optional(v.string()),
	DISCORD_CLIENT_ID: v.optional(v.string()),
	DISCORD_CLIENT_SECRET: v.optional(v.string()),

	SESSION_SECRET: v.pipe(v.string(), v.nonEmpty()),
	RESEND_API_KEY: v.optional(v.string()),
	EMAIL_FROM: v.optional(v.pipe(v.string(), v.email())),
	ADMIN_USER_EMAILS: v.pipe(
		v.optional(v.string(), ''),
		v.trim(),
		v.transform((val) => val.split(',')),
		v.array(v.pipe(v.string(), v.trim())),
	),
	DISABLE_CRONJOBS: v.optional(
		v.pipe(
			v.string(),
			v.transform((val) => val === 'true'),
		),
	),

	LOG_LEVEL: v.optional(v.string(), 'info'),
})

// Type inference
export type Env = v.InferOutput<typeof serverSchema>

// Process empty strings as undefined
const processEnv = { ...process.env }
Object.entries(processEnv).forEach(([key, value]) => {
	if (value === '') {
		delete processEnv[key]
	}
})

// Parse and create env object with client-side protection
const _env = v.parse(serverSchema, processEnv)

export const env = new Proxy(_env, {
	get(target, prop) {
		if (typeof window !== 'undefined') {
			throw new Error(
				'❌ Attempted to access server-side environment variable on the client',
			)
		}
		return Reflect.get(target, prop)
	},
})
