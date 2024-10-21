import { defineConfig } from 'drizzle-kit'
import { env } from './src/lib/env.server'

export default defineConfig({
	dialect: 'sqlite',
	out: './src/drizzle/migrations',
	schema: './src/drizzle/schemas',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	breakpoints: true,
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true,
})
