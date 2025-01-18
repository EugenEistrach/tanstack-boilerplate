import { logger } from '@trigger.dev/sdk/v3'
import { db } from '@/drizzle/db'

export async function syncEmbeddedDb() {
	try {
		await db.$client.sync()
		logger.info('Embedded database synced')
	} catch (err) {
		logger.error('Failed to sync embedded database', { err })
	}
}
