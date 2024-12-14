import { Queue, Worker } from 'bullmq'
import cronstrue from 'cronstrue'
import { RedisMemoryServer } from 'redis-memory-server'
import { env } from '@/lib/server/env.server'
import { logger } from '@/lib/server/logger.server'
import { formatMilliseconds } from '@/lib/shared/utils'

let redisServer: RedisMemoryServer | null = null

const getMockUrl = async () => {
	if (!redisServer) {
		redisServer = new RedisMemoryServer()
	}

	const host = await redisServer.getHost()
	const port = await redisServer.getPort()
	const url = `redis://${host}:${port}`

	logger.info({ url }, 'Using mock Redis server')
	return url
}

export const getJobConfig = async () => {
	return {
		connection: {
			url:
				env.NODE_ENV === 'test' || env.MOCKS
					? await getMockUrl()
					: env.REDIS_URL,
		},
	}
}

const jobConfig = await getJobConfig()

export const createTask = (
	id: string,
	options: {
		handler: () => Promise<void>
	},
) => {
	logger.debug({ taskId: id }, 'Creating new task')
	const queue = new Queue(id, jobConfig)
	return {
		queue,
		worker: new Worker(id, options.handler, jobConfig),
	}
}

export const scheduleTask = async (
	options:
		| {
				every: number
				task: {
					queue: Queue
				}
				enabled: boolean
		  }
		| {
				pattern: string
				task: {
					queue: Queue
				}
				enabled: boolean
		  },
) => {
	const taskName = options.task.queue.name

	try {
		logger.debug(
			{ taskName },
			'Obliterating existing task queue before scheduling',
		)

		await options.task.queue.obliterate({
			force: true,
		})

		if (!options.enabled) {
			logger.info({ taskName }, 'Task scheduling skipped - task is disabled')
			return
		}

		const opts =
			'every' in options
				? { every: options.every }
				: { pattern: options.pattern }

		const scheduleInfo =
			'every' in options
				? `every ${formatMilliseconds(options.every)} (${options.every}ms)`
				: `${cronstrue.toString(options.pattern)} (${options.pattern})`

		await options.task.queue.upsertJobScheduler(taskName, opts, {
			name: taskName,
		})

		logger.info(
			{
				taskName,
				schedule: scheduleInfo,
				options: opts,
			},
			'Task scheduled successfully',
		)
	} catch (error) {
		logger.error(
			{
				taskName,
				error,
				operation: 'scheduleTask',
			},
			'Failed to schedule or obliterate task',
		)
	}
}
