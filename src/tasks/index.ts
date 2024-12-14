import { Queue, Worker } from 'bullmq'
import { env } from '@/lib/server/env.server'

export const jobConfig = {
	connection: {
		url: env.REDIS_URL,
	},
}

export const createTask = (
	id: string,
	options: {
		handler: () => Promise<void>
	},
) => {
	const queue = new Queue(id, jobConfig)
	return {
		queue,
		worker: new Worker(id, options.handler, jobConfig),
	}
}

export const scheduleTask = async (options: {
	every: number
	task: {
		queue: Queue
	}
}) => {
	try {
		await options.task.queue.obliterate()
		if (env.DISABLE_CRONJOBS) {
			console.log(`Cronjobs are disabled. Skipping ${options.task.queue.name}`)
			return
		}

		console.log(`Scheduling job ${options.task.queue.name}`)
		await options.task.queue.upsertJobScheduler(
			options.task.queue.name,
			{
				every: options.every,
			},
			{
				name: options.task.queue.name,
			},
		)
	} catch (error) {
		console.error(`Error obliterating job ${options.task.queue.name}`, error)
	}

	console.log(`Scheduled job ${options.task.queue.name}`)
}
