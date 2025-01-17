import { createMiddleware, registerGlobalMiddleware } from '@tanstack/start'
import { getWebRequest } from 'vinxi/http'
import { pino } from '@/lib/server/logger.server'

export const loggingMiddleware = createMiddleware().server(
	async ({ next, data }) => {
		const request = getWebRequest()
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
			} catch (error) {
				pino.debug(
					{ error, operation: 'parseRequestBody' },
					'Could not parse request body',
				)
			}
		}

		pino.debug(
			{
				request: requestInfo,
				routeData: data,
			},
			'Server function received request',
		)

		try {
			const result = await next()
			const durationInMs = performance.now() - startTime

			pino.debug(
				{
					method: requestInfo.method,
					url: requestInfo.url,
					durationInMs,
				},
				'Server function completed',
			)

			return result
		} catch (error) {
			const durationInMs = performance.now() - startTime

			pino.debug(
				{
					method: requestInfo.method,
					url: requestInfo.url,
					durationInMs,
					error,
					operation: 'requestHandler',
				},
				'Server function failed',
			)

			throw error
		}
	},
)

registerGlobalMiddleware({ middleware: [loggingMiddleware] })
