import { Queue, Worker } from 'bullmq'
import { sql } from 'drizzle-orm'
import { db } from '../db'
import { jobConfig } from '../jobs'
import { sessionTable } from './auth-tables'
import { lucia } from '.'

const sessionCleanupQueue = new Queue('session-cleanup', jobConfig)
new Worker(
	'session-cleanup',
	async (job) => {
		await job.log('session-cleanup')
		const currentCount = db
			.select({ count: sql<number>`count(*)` })
			.from(sessionTable)
			.get()
		await lucia.deleteExpiredSessions()
		const newCount = db
			.select({ count: sql<number>`count(*)` })
			.from(sessionTable)
			.get()

		const diff = (currentCount?.count ?? 0) - (newCount?.count ?? 0)

		if (diff > 0) {
			await job.log(`${diff} sessions cleaned up`)
		}

		await job.log('session-cleanup done')
	},
	jobConfig,
)

export async function scheduleSessionCleanup() {
	console.log('scheduleSessionCleanup')
	await sessionCleanupQueue.obliterate()
	await sessionCleanupQueue.add(
		'session-cleanup',
		{},
		{
			repeat: {
				pattern: '*/5 * * * *', // every 5 minutes
			},
		},
	)
}
