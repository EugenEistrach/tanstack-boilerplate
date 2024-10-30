import { defineConfig } from 'drizzle-kit'
import { env } from '@/lib/env'

export default defineConfig({
	dialect: 'sqlite',
	out: './src/drizzle/migrations',
	schema: [
		'./src/drizzle/schemas/auth-schema.ts',
		'./src/drizzle/schemas/onboarding-schema.ts',
	],
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	breakpoints: true,
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true,
})
