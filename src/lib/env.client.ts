import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const clientEnv = createEnv({
	client: {
		VITE_AUTH_URL: z.string().min(1),
	},
	clientPrefix: 'VITE_',
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
})
