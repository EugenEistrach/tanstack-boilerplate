import { createMiddleware, registerGlobalMiddleware } from '@tanstack/start'
import { getWebRequest } from 'vinxi/http'
import { logger } from '@/lib/server/logger.server'

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
			} catch (err) {
				logger.debug('Could not parse request body', {
					err,
					operation: 'parseRequestBody',
				})
			}
		}

		logger.debug('Server function received request', {
			request: requestInfo,
			routeData: data,
		})

		try {
			const result = await next()
			const durationInMs = performance.now() - startTime

			logger.debug('Server function completed', {
				method: requestInfo.method,
				url: requestInfo.url,
				durationInMs,
			})

			return result
		} catch (err) {
			const durationInMs = performance.now() - startTime

			logger.debug('Server function failed', {
				method: requestInfo.method,
				url: requestInfo.url,
				durationInMs,
				err,
				operation: 'requestHandler',
			})

			throw err
		}
	},
)

registerGlobalMiddleware({ middleware: [loggingMiddleware] })
