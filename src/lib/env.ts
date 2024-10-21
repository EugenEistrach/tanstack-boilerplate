import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		BASE_URL: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		REDIS_URL: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().optional(),
		GITHUB_CLIENT_SECRET: z.string().optional(),
		SESSION_SECRET: z.string().min(1),
		RESEND_API_KEY: z.string().optional(),
		EMAIL_FROM: z.string().optional(),
	},

	runtimeEnv: {
		...process.env,
	},

	isServer: typeof window === 'undefined',
	emptyStringAsUndefined: true,
})
