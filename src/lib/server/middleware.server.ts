import { createMiddleware, registerGlobalMiddleware } from '@tanstack/start'
import { getWebRequest } from '@tanstack/start/server'
import { logger } from '@/lib/server/logger.server'

export const loggingMiddleware = createMiddleware().server(
	async ({ next, data }) => {
		const request = getWebRequest()

		if (!request) {
			throw new Error('Request not found')
		}

		const startTime = performance.now()

		// Extract useful request information
		const requestInfo = {
			method: request.method,
			url: request.url,
			headers: Object.fromEntries(request.headers.entries()),
			body: undefined as string | undefined,
		}

		// Add body to request info if it exists and content-type is json
		if (request.body) {
			try {
				const clonedRequest = request.clone()
				const body = await clonedRequest.text()
				requestInfo.body = body
			} catch (err) {
				logger.debug(
					{
						err,
						operation: 'parseRequestBody',
					},
					'Could not parse request body',
				)
			}
		}

		logger.debug(
			{
				request: requestInfo,
				routeData: data,
			},
			'Server function received request',
		)

		try {
			const result = await next()
			const durationInMs = performance.now() - startTime

			logger.debug(
				{
					method: requestInfo.method,
					url: requestInfo.url,
					durationInMs,
				},
				'Server function completed',
			)

			return result
		} catch (err) {
			const durationInMs = performance.now() - startTime

			logger.debug(
				{
					method: requestInfo.method,
					url: requestInfo.url,
					durationInMs,
					err,
					operation: 'requestHandler',
				},
				'Server function failed',
			)

			throw err
		}
	},
)

registerGlobalMiddleware({ middleware: [loggingMiddleware] })
