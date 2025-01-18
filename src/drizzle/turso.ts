import { db } from '@/drizzle/db'
import { logger } from '@/lib/server/logger.server'

export async function syncEmbeddedDb() {
	try {
		await db.$client.sync()
		logger.info('Embedded database synced')
	} catch (err) {
		logger.error(
			{ operation: 'syncEmbeddedDb', err },
			'Failed to sync embedded database',
		)
	}
}
