import 'dotenv/config'
import { spawn } from 'node:child_process'
import { createWriteStream, type WriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import Database from 'better-sqlite3'

const TEMP_DB_PATH = path.resolve('./scripts/.tmp/db.sqlite')
const OUTPUT_SQL_PATH = path.resolve('./scripts/.dump/db.sql')

interface ForeignKey {
	table: string
	referenced_table: string
}

interface TableInfo {
	name: string
}

interface ForeignKeyInfo {
	table: string
}

async function getDatabaseInfo() {
	const db = new Database(TEMP_DB_PATH)

	try {
		// Get all tables
		const tables = db
			.prepare(
				`
			SELECT name
			FROM sqlite_master
			WHERE type='table' AND name NOT LIKE 'sqlite_%'
		`,
			)
			.all() as TableInfo[]

		// Get all foreign key relationships
		const foreignKeys: ForeignKey[] = []
		for (const { name } of tables) {
			const tableInfo = db
				.prepare(`PRAGMA foreign_key_list('${name}')`)
				.all() as ForeignKeyInfo[]
			for (const fk of tableInfo) {
				foreignKeys.push({
					table: name,
					referenced_table: fk.table,
				})
			}
		}

		return { tables: tables.map((t) => t.name), foreignKeys }
	} finally {
		db.close()
	}
}

function topologicalSort(tables: string[], foreignKeys: ForeignKey[]) {
	const graph = new Map<string, Set<string>>()

	// Initialize graph
	for (const table of tables) {
		graph.set(table, new Set())
	}

	// Build dependency graph
	for (const fk of foreignKeys) {
		const dependencies = graph.get(fk.referenced_table)
		if (dependencies) {
			dependencies.add(fk.table)
		}
	}

	const sorted: string[] = []
	const visited = new Set<string>()
	const temp = new Set<string>()

	function visit(table: string) {
		if (temp.has(table)) {
			throw new Error(`Circular dependency detected involving table: ${table}`)
		}
		if (visited.has(table)) return

		temp.add(table)
		const dependencies = graph.get(table) || new Set()

		for (const dep of dependencies) {
			visit(dep)
		}

		temp.delete(table)
		visited.add(table)
		sorted.unshift(table)
	}

	for (const table of tables) {
		if (!visited.has(table)) {
			visit(table)
		}
	}

	return sorted
}

async function dumpTableData(table: string, writeStream: WriteStream) {
	return new Promise((resolve, reject) => {
		const sqlite = spawn('sqlite3', [TEMP_DB_PATH, `.dump ${table}`])
		let buffer = ''

		sqlite.stdout.on('data', (data: Buffer) => {
			buffer += data.toString()
		})

		sqlite.stderr.on('data', (data: Buffer) => {
			console.error(`SQLite Error for table ${table}:`, data.toString())
		})

		sqlite.on('close', (code) => {
			if (code === 0) {
				// Process complete buffer
				const statements = buffer
					.split('\n')
					.filter((line: string) => line.startsWith('INSERT INTO'))
					.join('\n--> statement-breakpoint\n')

				if (statements) {
					writeStream.write(statements + '\n')
				}
				resolve(void 0)
			} else {
				reject(
					new Error(
						`SQLite process exited with code ${code} for table ${table}`,
					),
				)
			}
		})

		sqlite.on('error', reject)
	})
}

async function dumpDb() {
	try {
		// Create temp directory
		await fs.mkdir(path.dirname(TEMP_DB_PATH), { recursive: true })
		await fs.mkdir(path.dirname(OUTPUT_SQL_PATH), { recursive: true })

		// Copy current database to temp location
		const currentDbPath =
			process.env['LOCAL_DATABASE_PATH']?.replace('file:', '') || 'db.sqlite'
		await fs.copyFile(currentDbPath, TEMP_DB_PATH)

		// Get database structure
		const { tables, foreignKeys } = await getDatabaseInfo()

		// Sort tables based on dependencies
		const sortedTables = topologicalSort(tables, foreignKeys)
		console.log('Dumping tables in order:', sortedTables.join(', '))

		const writeStream = createWriteStream(OUTPUT_SQL_PATH)

		// Dump each table in order
		for (const table of sortedTables) {
			console.log(`Dumping table: ${table}`)
			await dumpTableData(table, writeStream)
		}

		writeStream.end()
		console.log(`Dump SQL created at ${OUTPUT_SQL_PATH}`)
	} catch (error) {
		console.error('Error dumping database:', error)
		throw error
	} finally {
		// Clean up temporary database
		await fs
			.rm(path.dirname(TEMP_DB_PATH), { force: true, recursive: true })
			.catch(console.error)
	}
}

void dumpDb()
