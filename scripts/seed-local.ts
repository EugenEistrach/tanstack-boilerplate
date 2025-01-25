import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql } from 'drizzle-orm'
import { db } from '@/drizzle/db'

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const main = async () => {
	try {
		// Read the SQL file
		const sqlPath = resolve(__dirname, './seed/seed-local.sql')
		const sqlContent = readFileSync(sqlPath, 'utf-8')
		console.log('📄 Read SQL file:', sqlPath)

		// Split on semicolons and clean up statements
		const statements = sqlContent
			.split(';')
			.map((stmt) =>
				stmt
					.split('\n')
					.filter((line) => !line.trim().startsWith('--')) // Remove comment lines
					.join('\n')
					.trim(),
			)
			.filter(Boolean) // Remove empty statements

		console.log(`📝 Found ${statements.length} statements to execute`)

		// Execute each statement
		console.log('🌱 Seeding database...')
		for (const statement of statements) {
			console.log(
				'⚡️ Executing:',
				statement.slice(0, 100).replace(/\s+/g, ' ') + '...',
			)
			await db.run(sql.raw(statement))
		}

		console.log('✅ Database seeded successfully')
	} catch (error) {
		console.error('❌ Error seeding database:', error)
		process.exit(1)
	}
}

await main()
