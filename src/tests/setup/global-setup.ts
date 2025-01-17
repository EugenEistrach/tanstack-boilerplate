import path from 'node:path'
import { execaCommand } from 'execa'
import fsExtra from 'fs-extra'

export const BASE_DATABASE_PATH = path.join(
	process.cwd(),
	`./src/tests/drizzle/base.sqlite`,
)

export async function setup() {
	console.log('Setting up test database')
	const databaseExists = await fsExtra.pathExists(BASE_DATABASE_PATH)

	console.log('Database exists:', databaseExists)

	if (databaseExists) {
		const databaseLastModifiedAt = (await fsExtra.stat(BASE_DATABASE_PATH))
			.mtime
		const schemaDir = path.join(process.cwd(), 'src/drizzle/schemas')

		const schemaFiles = await fsExtra.readdir(schemaDir)

		let needsRebuild = false
		for (const file of schemaFiles) {
			if (!file.endsWith('.ts')) continue

			console.log('Checking schema file:', file)
			const schemaPath = path.join(schemaDir, file)
			const schemaLastModifiedAt = (await fsExtra.stat(schemaPath)).mtime

			if (schemaLastModifiedAt > databaseLastModifiedAt) {
				console.log('Schema file is newer than database:', file)
				needsRebuild = true
				break
			}
		}

		if (!needsRebuild) {
			console.log('No schema files are newer than database, skipping rebuild')
			return
		}
	}

	await fsExtra.ensureDir(path.dirname(BASE_DATABASE_PATH))

	console.log('Rebuilding test database: ', BASE_DATABASE_PATH)

	await execaCommand('pnpm db:reset', {
		stdio: 'inherit',
		env: {
			...process.env,
			// we are using drizzle kit commands to reset the db and in the config we use LOCAL_DATABASE_PATH for the path
			LOCAL_DATABASE_PATH: `${BASE_DATABASE_PATH}`,
		},
	})
}
