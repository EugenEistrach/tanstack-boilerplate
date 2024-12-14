import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { db } from '@/drizzle/db'

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const main = async () => {
	try {
		// Read the SQL file
		const sqlPath = resolve(__dirname, './seed/seed-local.sql')
		const sql = readFileSync(sqlPath, 'utf-8')

		// Split on statement breakpoints and filter empty statements
		const statements = sql
			.split('--> statement-breakpoint')
			.map((stmt) => stmt.trim())
			.filter(Boolean)

		// Execute each statement
		console.log('🌱 Seeding database...')
		for (const statement of statements) {
			await db.run(statement)
		}

		console.log('✅ Database seeded successfully')
	} catch (error) {
		console.error('❌ Error seeding database:', error)
		process.exit(1)
	}
}

await main()
