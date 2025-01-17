import * as v from 'valibot'

// Schema definition
const serverSchema = v.object({
	APP_NAME: v.optional(v.string(), `Tanstack Boilerplate`),

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

	TURSO_DATABASE_URL: v.optional(v.string()),
	TURSO_AUTH_TOKEN: v.optional(v.string()),

	LOCAL_DATABASE_PATH: v.pipe(v.string(), v.nonEmpty()),

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
const parseEnv = () => {
	const result = v.safeParse(serverSchema, processEnv)

	if (!result.success) {
		console.error('\n❌ Invalid Environment Variables:\n')

		for (const issue of result.issues) {
			const pathString = issue.path
				? issue.path.map((segment) => String(segment.key)).join('.')
				: 'unknown'

			console.error(`• ${pathString}: ${issue.message}`)
			console.error(`  Current value: ${processEnv[pathString] || 'missing'}\n`)
		}

		throw new Error(
			'🚨 Invalid environment variables. Check the logs above and update your .env file.',
		)
	}

	return result.output
}

const _env = parseEnv()

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
